
import base64url from 'base64url'
import crypto from 'crypto'
import { JWK } from 'node-jose'
import { HttpClient } from './http/http-client'
import { HttpClientAxios } from './http/http-client-axios'
import { InitiateAuthorizeRequest } from './model/initiate-authorize-request'
import { OPConfiguration } from './model/OPConfiguration'
import { TokenRequest } from './model/token/token-request'
import { extractJWKFromString, sign, verifySignature } from './util/jwk-util'
import { RequestHelper } from './util/request-helper'
import toJSON from './util/request-util'
import { IdToken } from './util/models/id-token.model'


export class VerifiedIdClient {

  private readonly deepLinkRegex: RegExp = /(.*):/g
  private readonly httpRegex: RegExp = /https?:/g

  private readonly wellKnownURI: string
  private readonly privateJWK: JWK.Key
  private readonly algorithm: string
  private readonly clientId: string

  private readonly httpClient: HttpClient
  private readonly helper: RequestHelper

  private opConfiguration: OPConfiguration

  private constructor(
    wellKnownURI: string,
    privateJWK: JWK.Key,
    algorithm: string,
    clientId: string,
    httpClient: HttpClient,
    helper: RequestHelper,
  ) {
    this.wellKnownURI = wellKnownURI
    this.privateJWK = privateJWK
    this.algorithm = algorithm
    this.clientId = clientId
    this.httpClient = httpClient
    this.helper = helper
  }

  public static async createInstance(param: { [key: string]: any }, jwkAsObject?: boolean ): Promise<VerifiedIdClient> {
    const wellKnownURI = param.wellKnownURI
    const privateJWK = await this.extractKey(param.privateJWK, jwkAsObject)
    const algorithm = param.algorithm ? param.algorithm : 'RS256'
    const clientId = param.clientId
    const httpClient = param.httpClient ? param.httpClient : HttpClientAxios.createInstance()
    const helper = param.helper ? param.helper : new RequestHelper()
    const client = new VerifiedIdClient(
      wellKnownURI,
      privateJWK,
      algorithm,
      clientId,
      httpClient,
      helper
    )
    await client.checkParameters()
    return client
  }

  // @TODO: Move to a utility like file/lib
  public static async extractKey(privateJWK: string, isBase64?: boolean): Promise<JWK.Key> {
    if (!privateJWK) {
      return null
    }
    return await extractJWKFromString(isBase64 ? Buffer.from(privateJWK, 'base64').toString() : require(privateJWK))
  }

  public setUpClient(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const wellKnownResponse = await this.httpClient.callSimpleGET(this.wellKnownURI)
        this.extractWellKnownData(wellKnownResponse)
        const jwksResponse = await this.httpClient.callSimpleGET(this.opConfiguration.jwksUri)
        await this.extractJWKSData(jwksResponse)
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }

  public initiateAuthorize(request: InitiateAuthorizeRequest): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        request.clientId = this.clientId
        if (!request.nonce) {
          request.nonce = this.helper.random()
        }
        let codeVerifier
        if (this.isDeepLink(request.redirectURI) && !request.codeChallenge) {
          codeVerifier = this.helper.random()
          request.codeChallenge = this.createHash(codeVerifier)
        }
        const now = this.helper.now()
        const authBody = this.jwtStandardClaims(now)
        const auth = await sign(this.privateJWK, authBody)
        const requestBody = Object.assign(this.jwtStandardClaims(now), toJSON(request))
        const requestData = await sign(this.privateJWK, requestBody)
        const response = await this.httpClient.initiateAuthorize(this.opConfiguration.initAuthorizeEndpoint, auth, requestData)
        const redirectionUri = `${this.opConfiguration.authorizationEndpoint}?request_uri=${response.request_uri}`
        const resolution: any = {
          requestObjectUri: response.request_uri,
          nonce: request.nonce,
          expiration: response.expires_in,
          redirectionUri
        }
        if (codeVerifier) {
          resolution.codeVerifier = codeVerifier
        }
        resolve(resolution)
      } catch (e) {
        reject(e)
      }
    })
  }

  public token(request: TokenRequest): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const now = this.helper.now()
        const authBody = this.jwtStandardClaims(now)
        const auth = await sign(this.privateJWK, authBody)
        const response = await this.httpClient.token(this.opConfiguration.tokenEndpoint, auth, request.code, request.redirectUri, request.codeVerifier)

        const extractedData = await verifySignature(this.opConfiguration.jwks, response.id_token) as IdToken
        if (request.nonce && extractedData.nonce && request.nonce !== extractedData.nonce) {
          reject(`Nonce mismatch. Expected: ${request.nonce}. Received: ${extractedData.nonce}`)
        }
        resolve(extractedData)
      } catch (e) {
        reject(e)
      }
    })
  }

  private async extractJWKSData(jwksResponse: any) {
    this.opConfiguration.jwks = await JWK.asKeyStore(jwksResponse)
  }

  private createHash(value: string): string {
    const hash = crypto.createHash('sha256').update(value).digest('base64')
    return base64url.fromBase64(hash)
  }

  private jwtStandardClaims(now: number): any {
    return {
      sub: this.clientId,
      aud: this.opConfiguration.issuer,
      iss: this.clientId,
      jti: this.helper.random(),
      exp: now + 30,
      iat: now,
      nbf: now
    }
  }

  private isDeepLink(link: string): boolean {
    if (link) {
      const matches = link.match(this.deepLinkRegex)
      if (matches.length > 0) {
        return !this.httpRegex.test(matches[0].toLocaleLowerCase())
      }
    }
    return false
  }


  private async checkParameters() {
    const missing = Object.entries(this).find(el => !el[1])
    return new Promise((resolve, reject) => {
      if (missing) {
        reject(`${missing[0]} must be declared`)
      }
      resolve()
    })
  }

  private extractWellKnownData(wellKnownResponse: any) {
    this.opConfiguration = new OPConfiguration()
    this.opConfiguration.authorizationEndpoint = wellKnownResponse.authorization_endpoint
    this.opConfiguration.initAuthorizeEndpoint = wellKnownResponse.pushed_authorization_request_endpoint
    this.opConfiguration.tokenEndpoint = wellKnownResponse.token_endpoint
    this.opConfiguration.issuer = wellKnownResponse.issuer
    this.opConfiguration.jwksUri = wellKnownResponse.jwks_uri
    Object.keys(this.opConfiguration).forEach(key => {
      const value = this.opConfiguration[key]
      if (!value) {
        throw new Error(`Value of ${key} missing from well-known configuration`)
      }
    })
  }
}