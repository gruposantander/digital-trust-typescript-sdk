import { Claims } from '../model/claims/sharing/claims'
import { AssertionClaims } from '../model/claims/verifying/assertion-claims'
import { InitiateAuthorizeRequestBuilder } from '../model/initiate-authorize-requestBuilder'
import toJSON from './request-util'
import { Balance } from '../model/claims/enums/balance'

const claims: Claims = new Claims()
const assertionClaims: AssertionClaims = new AssertionClaims()

describe('initiate authorize request', () => {
  beforeEach(() => {
    claims.givenName().withEssential(true).withPurpose('Given name purpose')
    assertionClaims.givenName().equal('John').withPurpose('This is why RP is verifying your name')
    assertionClaims.email().equal('jane.doe@op-example.com').withPurpose('This is why RP is verifying your email')
    assertionClaims.birthdate().equal(new Date(Date.parse('1970-01-01'))).withPurpose('This is why RP is verifying your DOB')
    assertionClaims.age().gt(18).withPurpose('age purpose')
    assertionClaims.totalBalance()
      .withAssertion(Balance.amount().eq(100.01))
      .withAssertion(Balance.currency().eq('GBP'))
      .withPurpose('total balance assertion purpose')
      .withEssential(true)
  })

  it('should output correct json format', () => {
    const request = new InitiateAuthorizeRequestBuilder()
      .withState('state-123')
      .withRedirectURI('https://rp-example.com/callback')
      .withNonce('nonce-11111111-1111-1111-1111-111111111111')
      .withClaims(claims)
      .withAssertionClaims(assertionClaims)
      .withPurpose('generic top level purpose')
      .build()
    request.clientId = 'my-client-id'
    expect(toJSON(request)).toMatchObject(require('../test-resources/init.authorize/initiate-authorize-content.json'))
  })

  it('should fail if claim structure does not exist', () => {
    // @ts-ignore
    assertionClaims._claims.push(new Error('test'))
    const request = new InitiateAuthorizeRequestBuilder()
      .withState('state-123')
      .withRedirectURI('https://rp-example.com/callback')
      .withNonce('nonce-11111111-1111-1111-1111-111111111111')
      .withClaims(claims)
      .withAssertionClaims(assertionClaims)
      .withPurpose('generic top level purpose')
      .build()
    request.clientId = 'my-client-id'
    expect(() => toJSON(request))
      .toThrowError('Error does not exist')
  })
})