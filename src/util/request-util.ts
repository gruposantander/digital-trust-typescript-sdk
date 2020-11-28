import { AssertionClaimComplex } from '../model/claims/verifying/assertion-claim-complex'
import { AssertionClaim } from '../model/claims/verifying/assertion-claim'
import { AssertionClaimSimple } from '../model/claims/verifying/assertion-claim-simple'
import { InitiateAuthorizeRequest } from '../model/initiate-authorize-request'
import { AssertionClaims } from '../model/claims/verifying/assertion-claims'
import { Claims } from '../model/claims/sharing/claims'
import { AssertionClaimIdentifier } from '../model/claims/verifying/assertion-claim-identifier'

export default function toJSON(request: InitiateAuthorizeRequest): {} {
  const idToken = prepareSharingClaims(request.claims)
  idToken.assertion_claims = prepareVerifyingClaims(request.assertionClaims)
  const json: any = {
    state: request.state,
    redirect_uri: request.redirectURI,
    nonce: request.nonce,
    response_type: 'code',
    scope: 'openid',
    client_id: request.clientId,
    claims: {
      purpose: request.purpose,
      id_token: idToken
    }
  }
  if (request.codeChallenge) {
    json.code_challenge = request.codeChallenge
    json.code_challenge_method = 'S256'
  }
  return json
}

function prepareVerifyingClaims(assertionClaims: AssertionClaims) {
  const verifyingClaims = {}
  assertionClaims.claims.forEach(claim => {
    verifyingClaims[claim.claimName] = {
      purpose: claim.purpose,
      ial: claim.ial,
      essential: claim.essential
    }
    let assertion = {}
    const type = claim.constructor.name
    switch (type) {
      case 'AssertionClaimComplex':
        prepareAssertionForComplexClaim(claim, assertion)
        assertion = { props: assertion }
        break
      case 'AssertionClaimIdentifier':
        if ((claim as AssertionClaimIdentifier).identifier) {
          prepareAssertionForIdentifierClaim(claim, assertion)
        } else {
          prepareAssertionForComplexClaim(claim, assertion)
        }
        assertion = { props: assertion }
        break
      case 'AssertionClaimSimple':
      case 'AssertionClaimComparator':
        prepareAssertionForSimpleClaim(claim, assertion)
        break
      default:
        throw Error(`${type} does not exist`)
    }
    verifyingClaims[claim.claimName].assertion = assertion
  })
  return verifyingClaims
}

function prepareAssertionForSimpleClaim(claim: AssertionClaim, assertion: {}) {
  const simpleClaim = claim as AssertionClaimSimple<any>
  assertion[simpleClaim.operator] = prepareOperand(simpleClaim.operand)
}

function prepareAssertionForComplexClaim(claim: AssertionClaim, assertion: any) {
  const complexClaim = claim as AssertionClaimComplex
  complexClaim.properties.forEach(property => {
    const internalAssertion = {}
    internalAssertion[property.operator] = property.operand
    assertion[property.propertyName] = internalAssertion
  })
}

function prepareAssertionForIdentifierClaim(claim: AssertionClaim, assertion: any) {
  const identifierClaim = claim as AssertionClaimIdentifier
  const internalAssertion: any = {}
  internalAssertion[identifierClaim.identifier] = { props: {} }

  identifierClaim.properties.forEach(property => {
    const subInternalAssertion = { [property.operator]: property.operand }

    internalAssertion[identifierClaim.identifier].props[property.propertyName] = subInternalAssertion
    assertion.identifiers = internalAssertion
  })
}

function prepareSharingClaims(claims: Claims): any {
  const idToken = {}
  claims.claims.forEach(claim => {
    idToken[claim.claimName] = {
      purpose: claim.purpose,
      ial: claim.ial,
      essential: claim.essential
    }
  })
  return idToken
}
function prepareOperand(operand: any): any {
  if (operand instanceof Date) {
    return operand.toISOString().split('T')[0]
  }
  else return operand
}