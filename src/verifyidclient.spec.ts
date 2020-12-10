import { anyString, anything, instance, mock, resetCalls, verify, when, reset, spy } from 'ts-mockito'
import { HttpClient } from './http/http-client'
import { HttpClientAxios } from './http/http-client-axios'
import { Claims } from './model/claims/sharing/claims'
import { Address } from './model/claims/verifying/address'
import { AssertionClaims } from './model/claims/verifying/assertion-claims'
import { InitiateAuthorizeRequestBuilder } from './model/initiate-authorize-requestBuilder'
import { TokenRequestBuilder } from './model/token/token-requestBuilder'
import { Constants } from './test-resources/constants'
import { RequestHelper } from './util/request-helper'
import { VerifiedIdClient } from './verifyidclient'
import { JWK } from 'node-jose'
import _ from 'lodash'

describe('VerifiedIdClient', () => {
  describe('constructor', () => {
    describe('should succeed if all mandatory parameters are passed', () => {
      it('algorithm not passed', async () => {
        const data = await VerifiedIdClient.createInstance({
          wellKnownURI: 'well',
          privateJWK: './test-resources/private-jwk.json',
          clientId: '123'
        })
        // @ts-ignore
        expect(data.algorithm).toEqual('RS256')
      })

      it('algorithm passed', async () => {
        const data = await VerifiedIdClient.createInstance({
          wellKnownURI: 'well',
          privateJWK: './test-resources/private-jwk.json',
          clientId: '123',
          algorithm: 'RS512'
        })
        // @ts-ignore
        expect(data.algorithm).toEqual('RS512')
      })
    })

    it('should fail if wellKnownURI is missing', () => {
      return expect(VerifiedIdClient.createInstance({
        privateJWK: './test-resources/private-jwk.json',
        clientId: '123'
      })).rejects.toEqual('wellKnownURI must be declared')
    })

    it('should fail if privateJWK is missing', () => {
      return expect(VerifiedIdClient.createInstance({
        wellKnownURI: 'well',
        clientId: '123'
      })).rejects.toEqual('privateJWK must be declared')
    })

    it('should fail if clientId is missing', () => {
      return expect(VerifiedIdClient.createInstance({
        wellKnownURI: 'well',
        privateJWK: './test-resources/private-jwk.json',
      })).rejects.toEqual('clientId must be declared')
    })

    it('should load a privateJWK from a file path', async () => {
      const key = await VerifiedIdClient.extractKey('./test-resources/private-jwk.json')
      // @ts-ignore
      expect(key.kid).toEqual('test-key')
    })

    it('should load a privateJWK from a base64 string', async () => {
      const key = await VerifiedIdClient.extractKey(Constants.privateJWT, true)
      // @ts-ignore
      expect(key.kid).toEqual('test-key')
    })


  })
  describe('method: ', () => {
    let requestHelperMock: RequestHelper
    let requestHelper: RequestHelper

    let httpClientMock: HttpClientAxios
    let httpClient: HttpClient

    let verifyidclient: VerifiedIdClient

    beforeEach(async (done) => {
      requestHelperMock = mock(RequestHelper)
      requestHelper = instance(requestHelperMock)
      httpClientMock = mock(HttpClientAxios)
      httpClient = instance(httpClientMock)
      verifyidclient = await VerifiedIdClient.createInstance({
        wellKnownURI: 'https://live.iamid.io/.well-known/openid-configuration',
        privateJWK: './test-resources/private-jwk.json',
        clientId: '123',
        httpClient,
        helper: requestHelper
      })
      done()
    })

    describe('setUP', () => {
      it('should set up client if well-formed responses are returned by back end', async (done) => {
        when(
          httpClientMock
            .callSimpleGET(anyString()))
          .thenReturn(require('./test-resources/wellKnown.json'))
          .thenReturn(require('./test-resources/jwks.json'))

        await verifyidclient.setUpClient()

        // @ts-ignore
        expect(verifyidclient.opConfiguration).not.toBeUndefined()
        // @ts-ignore
        expect(verifyidclient.opConfiguration.authorizationEndpoint).toEqual('http://localhost:9099/web/login')
        // @ts-ignore
        expect(verifyidclient.opConfiguration.initAuthorizeEndpoint).toEqual('http://localhost:9099/initiate-authorize')
        // @ts-ignore
        expect(verifyidclient.opConfiguration.tokenEndpoint).toEqual('http://localhost:9099/token')
        // @ts-ignore
        expect(verifyidclient.opConfiguration.jwksUri).toEqual('http://localhost:9099/jwks')
        // @ts-ignore
        expect(verifyidclient.opConfiguration.issuer).toEqual('http://localhost:9099')
        // @ts-ignore
        expect(verifyidclient.opConfiguration.jwks.get('op_key_1').toJSON().n).toEqual(require('./test-resources/jwks.json').keys[0].n)
        // @ts-ignore
        expect(verifyidclient.opConfiguration.jwks.get('op_key_1').toJSON().e).toEqual(require('./test-resources/jwks.json').keys[0].e)
        // @ts-ignore
        expect(verifyidclient.opConfiguration.jwks.get('op_key_1').kty).toEqual(require('./test-resources/jwks.json').keys[0].kty)
        // @ts-ignore
        expect(verifyidclient.opConfiguration.jwks.get('op_key_1').kid).toEqual(require('./test-resources/jwks.json').keys[0].kid)
        // @ts-ignore
        expect(verifyidclient.opConfiguration.jwks.get('op_key_1').use).toEqual(require('./test-resources/jwks.json').keys[0].use)

        verify(httpClientMock.callSimpleGET('https://live.iamid.io/.well-known/openid-configuration')).called()
        verify(httpClientMock.callSimpleGET('http://localhost:9099/jwks')).called()

        done()
      })
      it('should fail settinh up client if malformed well known responses are returned by back end', async (done) => {
        const wellKnownResponse = _.cloneDeep(require('./test-resources/wellKnown.json'))
        delete wellKnownResponse.authorization_endpoint
        when(
          httpClientMock
            .callSimpleGET(anyString()))
          .thenReturn(wellKnownResponse)

        await expect(verifyidclient.setUpClient())
          .rejects.toEqual(new Error('Value of authorizationEndpoint missing from well-known configuration'))

        verify(httpClientMock.callSimpleGET('https://live.iamid.io/.well-known/openid-configuration')).called()
        verify(httpClientMock.callSimpleGET('http://localhost:9099/jwks')).never()

        done()
      })

      it('should fail settinh up client if malformed jwks responses are returned by back end', async (done) => {
        const jwksResponse = _.cloneDeep(require('./test-resources/jwks.json'))
        jwksResponse.keys[0].kty = 'INVALID'
        when(
          httpClientMock
            .callSimpleGET(anyString()))
          .thenReturn(require('./test-resources/wellKnown.json'))
          .thenReturn(jwksResponse)

        await expect(verifyidclient.setUpClient())
          .rejects.toEqual(new Error('unsupported key type'))

        verify(httpClientMock.callSimpleGET('https://live.iamid.io/.well-known/openid-configuration')).called()
        verify(httpClientMock.callSimpleGET('http://localhost:9099/jwks')).called()

        done()
      })
    })
    describe('initiate authorize', () => {
      let claims: Claims
      let assertionClaims: AssertionClaims

      beforeEach(() => {
        claims = new Claims()
        claims.givenName().withIAL(2)

        assertionClaims = new AssertionClaims()
        assertionClaims.age().gt(21).withPurpose('age purpose')
        assertionClaims.address()
          .withAssertion(Address.postalCode().eq('MK9 1BB'))
          .withAssertion(Address.country().eq('UK'))
          .withPurpose('Address purpose')

        // @ts-ignore
        verifyidclient.opConfiguration = {
          initAuthorizeEndpoint: 'http://openid.io/initiate-authorize',
          authorizationEndpoint: 'http://openid.io/authorize',
          tokenEndpoint: 'http://openid.io/token',
          issuer: 'http://openid.io/',
          jwksUri: 'http://openid.io/jwks',
          jwks: require('./test-resources/jwks.json')
        }
      })
      describe('should succeed', () => {
        it('without redirectURI, nonce, code challenge (https callback)', async () => {
          when(httpClientMock.initiateAuthorize(anyString(), anyString(), anyString()))
            .thenReturn(require('./test-resources/init.authorize/response.json'))
          when(requestHelperMock.random())
            .thenReturn('nonce-1111')
            .thenReturn('jti-1111')
            .thenReturn('jti-2222')
          when(requestHelperMock.now())
            .thenReturn(1)

          const request = new InitiateAuthorizeRequestBuilder()
            .withAssertionClaims(assertionClaims)
            .withClaims(claims)
            .withPurpose('top level purpose')
            .build()
          const response = await verifyidclient.initiateAuthorize(request)

          expect(response.requestObjectUri).toEqual('urn:op.iamid.io:6nLpmuKd-VWx83Hp1i9lKPxTowPLhh58Wd_PNKf4zVt')
          expect(response.nonce).toEqual('nonce-1111')
          expect(response.expiration).toEqual(1200008)
          expect(response.redirectionUri).toEqual('http://openid.io/authorize?request_uri=urn:op.iamid.io:6nLpmuKd-VWx83Hp1i9lKPxTowPLhh58Wd_PNKf4zVt')
          expect(response.codeVerifier).toBeUndefined()
          verify(requestHelperMock.random()).thrice()
          verify(requestHelperMock.now()).once()
          verify(httpClientMock.initiateAuthorize('http://openid.io/initiate-authorize', Constants.authJWT, Constants.requestJWT)).called()
        })
        it('with redirectURI, without nonce, code challenge (https callback)', async () => {
          when(httpClientMock.initiateAuthorize(anyString(), anyString(), anyString()))
            .thenReturn(require('./test-resources/init.authorize/response.json'))
          when(requestHelperMock.random())
            .thenReturn('nonce-1111')
            .thenReturn('jti-1111')
            .thenReturn('jti-2222')
          when(requestHelperMock.now())
            .thenReturn(1)

          const request = new InitiateAuthorizeRequestBuilder()
            .withRedirectURI('https://rp.example.com/callback')
            .withAssertionClaims(assertionClaims)
            .withClaims(claims)
            .withPurpose('top level purpose')
            .build()
          const response = await verifyidclient.initiateAuthorize(request)

          expect(response.requestObjectUri).toEqual('urn:op.iamid.io:6nLpmuKd-VWx83Hp1i9lKPxTowPLhh58Wd_PNKf4zVt')
          expect(response.nonce).toEqual('nonce-1111')
          expect(response.expiration).toEqual(1200008)
          expect(response.redirectionUri).toEqual('http://openid.io/authorize?request_uri=urn:op.iamid.io:6nLpmuKd-VWx83Hp1i9lKPxTowPLhh58Wd_PNKf4zVt')
          expect(response.codeVerifier).toBeUndefined()
          verify(requestHelperMock.random()).thrice()
          verify(requestHelperMock.now()).once()
          verify(httpClientMock.initiateAuthorize('http://openid.io/initiate-authorize', Constants.authJWT, Constants.requestJWTWithRedirectURIAndGeneratedNonce)).called()
        })
        it('with redirectURI, nonce, without code challenge (https callback)', async () => {
          when(httpClientMock.initiateAuthorize(anyString(), anyString(), anyString()))
            .thenReturn(require('./test-resources/init.authorize/response.json'))
          when(requestHelperMock.random())
            .thenReturn('jti-1111')
            .thenReturn('jti-2222')
          when(requestHelperMock.now())
            .thenReturn(1)

          const request = new InitiateAuthorizeRequestBuilder()
            .withRedirectURI('https://rp.example.com/callback')
            .withAssertionClaims(assertionClaims)
            .withClaims(claims)
            .withNonce('my-nonce')
            .withPurpose('top level purpose')
            .build()
          const response = await verifyidclient.initiateAuthorize(request)

          expect(response.requestObjectUri).toEqual('urn:op.iamid.io:6nLpmuKd-VWx83Hp1i9lKPxTowPLhh58Wd_PNKf4zVt')
          expect(response.nonce).toEqual('my-nonce')
          expect(response.expiration).toEqual(1200008)
          expect(response.redirectionUri).toEqual('http://openid.io/authorize?request_uri=urn:op.iamid.io:6nLpmuKd-VWx83Hp1i9lKPxTowPLhh58Wd_PNKf4zVt')
          expect(response.codeVerifier).toBeUndefined()
          verify(requestHelperMock.random()).twice()
          verify(requestHelperMock.now()).once()
          verify(httpClientMock.initiateAuthorize('http://openid.io/initiate-authorize', Constants.authJWT, Constants.requestJWTWithRedirectURIAndCustomNonce)).called()
        })
        it('with redirectURI, nonce, without code challenge (deeplink callback)', async () => {
          when(httpClientMock.initiateAuthorize(anyString(), anyString(), anyString()))
            .thenReturn(require('./test-resources/init.authorize/response.json'))
          when(requestHelperMock.random())
            .thenReturn('verifier-1111')
            .thenReturn('jti-1111')
            .thenReturn('jti-2222')
          when(requestHelperMock.now())
            .thenReturn(1)

          const request = new InitiateAuthorizeRequestBuilder()
            .withRedirectURI('rp-example://callback')
            .withAssertionClaims(assertionClaims)
            .withClaims(claims)
            .withNonce('my-nonce')
            .withPurpose('top level purpose')
            .build()
          const response = await verifyidclient.initiateAuthorize(request)

          expect(response.requestObjectUri).toEqual('urn:op.iamid.io:6nLpmuKd-VWx83Hp1i9lKPxTowPLhh58Wd_PNKf4zVt')
          expect(response.nonce).toEqual('my-nonce')
          expect(response.expiration).toEqual(1200008)
          expect(response.redirectionUri).toEqual('http://openid.io/authorize?request_uri=urn:op.iamid.io:6nLpmuKd-VWx83Hp1i9lKPxTowPLhh58Wd_PNKf4zVt')
          expect(response.codeVerifier).toEqual('verifier-1111')
          verify(requestHelperMock.random()).thrice()
          verify(requestHelperMock.now()).once()
          verify(httpClientMock.initiateAuthorize('http://openid.io/initiate-authorize', Constants.authJWT, Constants.requestJWTWithRedirectURIAndCustomNonceAndGeneratedCodeChallenge)).called()
        })
        it('with redirectURI, nonce, code challenge (deeplink callback)', async () => {
          when(httpClientMock.initiateAuthorize(anyString(), anyString(), anyString()))
            .thenReturn(require('./test-resources/init.authorize/response.json'))
          when(requestHelperMock.random())
            .thenReturn('jti-1111')
            .thenReturn('jti-2222')
          when(requestHelperMock.now())
            .thenReturn(1)

          const request = new InitiateAuthorizeRequestBuilder()
            .withRedirectURI('rp-example://callback')
            .withAssertionClaims(assertionClaims)
            .withClaims(claims)
            .withNonce('my-nonce')
            .withPurpose('top level purpose')
            .withCodeChallenge('challenge-1111')
            .build()
          const response = await verifyidclient.initiateAuthorize(request)

          expect(response.requestObjectUri).toEqual('urn:op.iamid.io:6nLpmuKd-VWx83Hp1i9lKPxTowPLhh58Wd_PNKf4zVt')
          expect(response.nonce).toEqual('my-nonce')
          expect(response.expiration).toEqual(1200008)
          expect(response.redirectionUri).toEqual('http://openid.io/authorize?request_uri=urn:op.iamid.io:6nLpmuKd-VWx83Hp1i9lKPxTowPLhh58Wd_PNKf4zVt')
          expect(response.codeVerifier).toBeUndefined()
          verify(requestHelperMock.random()).twice()
          verify(requestHelperMock.now()).once()
          verify(httpClientMock.initiateAuthorize('http://openid.io/initiate-authorize', Constants.authJWT, Constants.requestJWTWithRedirectURIAndCustomNonceAndCustomCodeChallenge)).called()
        })
      })
      describe('should fail', () => {
        it('if backend returns an error', async () => {
          when(httpClientMock.initiateAuthorize(anyString(), anyString(), anyString()))
            .thenReject(new Error('generic error'))
          when(requestHelperMock.random())
            .thenReturn('nonce-1111')
            .thenReturn('jti-1111')
            .thenReturn('jti-2222')
          when(requestHelperMock.now())
            .thenReturn(1)

          const request = new InitiateAuthorizeRequestBuilder()
            .withAssertionClaims(assertionClaims)
            .withClaims(claims)
            .withPurpose('top level purpose')
            .build()
          await expect(verifyidclient.initiateAuthorize(request))
            .rejects.toEqual(new Error('generic error'))

          verify(requestHelperMock.random()).thrice()
          verify(requestHelperMock.now()).once()
          verify(httpClientMock.initiateAuthorize('http://openid.io/initiate-authorize', Constants.authJWT, Constants.requestJWT)).called()
        })
      })
    })
    describe('token', () => {
      let tokenResponse

      beforeEach(async (done) => {
        const keystore = await JWK.asKeyStore(require('./test-resources/jwks.json'))
        // @ts-ignore
        verifyidclient.opConfiguration = {
          initAuthorizeEndpoint: 'http://openid.io/initiate-authorize',
          authorizationEndpoint: 'http://openid.io/authorize',
          tokenEndpoint: 'http://openid.io/token',
          issuer: 'http://openid.io/',
          jwksUri: 'http://openid.io/jwks',
          jwks: keystore
        }
        tokenResponse = require('./test-resources/token/token-response.json')
        done()
      })

      describe('should succeed', () => {
        it('without redirectURI, nonce, codeVerifier', async () => {
          when(httpClientMock.token(anyString(), anyString(), anyString(), anything(), anything()))
            .thenReturn(require('./test-resources/token/token-response.json'))
          when(requestHelperMock.random())
            .thenReturn('jti-1111')
          when(requestHelperMock.now())
            .thenReturn(1)

          const tokenRequest = new TokenRequestBuilder()
            .withCode('101')
            .build()
          const response = await verifyidclient.token(tokenRequest)

          expect(response.sub).toEqual('af06cec1daecb383ad2fce124c7c00fdba538f2317920fa1529a4fa034d78d4e')
          expect(response.assertion_claims.age).toEqual({ result: true })
          expect(response.assertion_claims.email).toEqual({ result: false })
          expect(response.nonce).toEqual('aNonce')
          expect(response.at_hash).toEqual('PdxJ8IhdZeni41xiPUzplw')
          expect(response.phone_number).toEqual('+44000000000')
          expect(response.exp).toEqual(1585666518)
          expect(response.iat).toEqual(1585665918)
          expect(response.iss).toEqual('https://op.iamid.io')
          expect(response.txn).toEqual('xNFK1lta6QrzbHMtmImWx')
          verify(requestHelperMock.random()).once()
          verify(requestHelperMock.now()).once()
          verify(httpClientMock.token('http://openid.io/token', Constants.authJWT, '101', undefined, undefined)).called()
        })
        it('with redirectURI, without nonce, codeVerifier', async () => {
          when(httpClientMock.token(anyString(), anyString(), anyString(), anything(), anything()))
            .thenReturn(tokenResponse)
          when(requestHelperMock.random())
            .thenReturn('jti-1111')
          when(requestHelperMock.now())
            .thenReturn(1)

          const tokenRequest = new TokenRequestBuilder()
            .withRedirectUri('https://test.com')
            .withCode('101')
            .build()
          const response = await verifyidclient.token(tokenRequest)

          expect(response.sub).toEqual('af06cec1daecb383ad2fce124c7c00fdba538f2317920fa1529a4fa034d78d4e')
          expect(response.assertion_claims.age).toEqual({ result: true })
          expect(response.assertion_claims.email).toEqual({ result: false })
          expect(response.nonce).toEqual('aNonce')
          expect(response.at_hash).toEqual('PdxJ8IhdZeni41xiPUzplw')
          expect(response.phone_number).toEqual('+44000000000')
          expect(response.exp).toEqual(1585666518)
          expect(response.iat).toEqual(1585665918)
          expect(response.iss).toEqual('https://op.iamid.io')
          expect(response.txn).toEqual('xNFK1lta6QrzbHMtmImWx')
          verify(requestHelperMock.random()).once()
          verify(requestHelperMock.now()).once()
          verify(httpClientMock.token('http://openid.io/token', Constants.authJWT, '101', 'https://test.com', undefined)).called()
        })
        it('with redirectURI, nonce, without codeVerifier', async () => {
          when(httpClientMock.token(anyString(), anyString(), anyString(), anything(), anything()))
            .thenReturn(tokenResponse)
          when(requestHelperMock.random())
            .thenReturn('jti-1111')
          when(requestHelperMock.now())
            .thenReturn(1)

          const tokenRequest = new TokenRequestBuilder()
            .withRedirectUri('https://test.com')
            .withCode('101')
            .withNonce('aNonce')
            .build()
          const response = await verifyidclient.token(tokenRequest)

          expect(response.sub).toEqual('af06cec1daecb383ad2fce124c7c00fdba538f2317920fa1529a4fa034d78d4e')
          expect(response.assertion_claims.age).toEqual({ result: true })
          expect(response.assertion_claims.email).toEqual({ result: false })
          expect(response.nonce).toEqual('aNonce')
          expect(response.at_hash).toEqual('PdxJ8IhdZeni41xiPUzplw')
          expect(response.phone_number).toEqual('+44000000000')
          expect(response.exp).toEqual(1585666518)
          expect(response.iat).toEqual(1585665918)
          expect(response.iss).toEqual('https://op.iamid.io')
          expect(response.txn).toEqual('xNFK1lta6QrzbHMtmImWx')
          verify(requestHelperMock.random()).once()
          verify(requestHelperMock.now()).once()
          verify(httpClientMock.token('http://openid.io/token', Constants.authJWT, '101', 'https://test.com', undefined)).called()
        })
        it('with redirectURI, nonce, codeVerifier', async () => {
          when(httpClientMock.token(anyString(), anyString(), anyString(), anything(), anything()))
            .thenReturn(tokenResponse)
          when(requestHelperMock.random())
            .thenReturn('jti-1111')
          when(requestHelperMock.now())
            .thenReturn(1)

          const tokenRequest = new TokenRequestBuilder()
            .withRedirectUri('https://test.com')
            .withCodeVerifier('verifier-1111')
            .withCode('101')
            .withNonce('aNonce')
            .build()
          const response = await verifyidclient.token(tokenRequest)

          expect(response.sub).toEqual('af06cec1daecb383ad2fce124c7c00fdba538f2317920fa1529a4fa034d78d4e')
          expect(response.assertion_claims.age).toEqual({ result: true })
          expect(response.nonce).toEqual('aNonce')
          expect(response.at_hash).toEqual('PdxJ8IhdZeni41xiPUzplw')
          expect(response.phone_number).toEqual('+44000000000')
          expect(response.exp).toEqual(1585666518)
          expect(response.iat).toEqual(1585665918)
          expect(response.iss).toEqual('https://op.iamid.io')
          expect(response.txn).toEqual('xNFK1lta6QrzbHMtmImWx')
          verify(requestHelperMock.random()).once()
          verify(requestHelperMock.now()).once()
          verify(httpClientMock.token('http://openid.io/token', Constants.authJWT, '101', 'https://test.com', 'verifier-1111')).called()
        })
      })
      describe('should fail', () => {
        it('without redirectURI, nonce, codeVerifier, wrong signature', async () => {
          const tokenResponseWrongSignature = { ...tokenResponse }
          tokenResponseWrongSignature.id_token = Constants.idTokenInvalidSignature
          when(httpClientMock.token(anyString(), anyString(), anyString(), anything(), anything()))
            .thenReturn(tokenResponseWrongSignature)
          when(requestHelperMock.random())
            .thenReturn('jti-1111')
          when(requestHelperMock.now())
            .thenReturn(1)
          const tokenRequest = new TokenRequestBuilder()
            .withCode('101')
            .build()

          await expect(verifyidclient.token(tokenRequest))
            .rejects.toEqual(new Error('no key found'))

          verify(requestHelperMock.random()).once()
          verify(requestHelperMock.now()).once()
          verify(httpClientMock.token('http://openid.io/token', Constants.authJWT, '101', undefined, undefined)).called()
        })
        it('with redirectURI, wrong nonce, without codeVerifier', async () => {
          when(httpClientMock.token(anyString(), anyString(), anyString(), anything(), anything()))
            .thenReturn(tokenResponse)
          when(requestHelperMock.random())
            .thenReturn('jti-1111')
          when(requestHelperMock.now())
            .thenReturn(1)

          const tokenRequest = new TokenRequestBuilder()
            .withRedirectUri('https://test.com')
            .withCode('101')
            .withNonce('wrong-nonce')
            .build()
          await expect(verifyidclient.token(tokenRequest))
            .rejects.toBe('Nonce mismatch. Expected: wrong-nonce. Received: aNonce')

          verify(requestHelperMock.random()).once()
          verify(requestHelperMock.now()).once()
          verify(httpClientMock.token('http://openid.io/token', Constants.authJWT, '101', 'https://test.com', undefined)).called()
        })
      })
    })
  })
})
