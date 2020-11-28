const { Claims, AssertionClaims, Address, Balance, Account, Identifier } = require('@gruposantander/rp-client-typescript').Model
const { VerifiedIdClient, InitiateAuthorizeRequestBuilder, TokenRequestBuilder } = require('@gruposantander/rp-client-typescript').Client

const resolve = require('path').resolve

const wellKnownUri = 'https://op.iamid.io/.well-known/openid-configuration';

const claims = new Claims()
claims.email().withEssential(true).withPurpose('email purpose')
claims.givenName().withIAL(2)
claims.bankAccount().withPurpose('Please give it to us so we can identify you')
claims.lastYearMoneyIn().withPurpose('Last year money in purpose')

const assertionClaims = new AssertionClaims()
assertionClaims.bankAccount()
  .withIdentifier(Identifier.SOME)
  .withAssertion(Account.type().eq('UK.SortCodeAccountNumber'))
  .withAssertion(Account.identification().eq('09012700047186'))
assertionClaims.age().gt(21).withPurpose('age purpose')
assertionClaims.address()
  .withAssertion(Address.postalCode().eq('MK9 1BB'))
  .withAssertion(Address.country().eq('UK'))
  .withPurpose('Address purpose')

assertionClaims.lastYearMoneyIn().withPurpose('Last year money in purpose')
  .withAssertion(Balance.amount().gt(200))

// tokenExample()
doInitAuthorize()

async function doInitAuthorize() {
  try {
    const verifyidclient = await VerifiedIdClient.createInstance({
      wellKnownURI: wellKnownUri,
      privateJWK: resolve('./secrets/quick-jobs.json'),
      clientId: 'IIvRB-z9e0mTVDfrXpAsy'
    })
    await verifyidclient.setUpClient()
    const request = new InitiateAuthorizeRequestBuilder()
      .withRedirectURI('http://localhost:4201/profile')
      .withAssertionClaims(assertionClaims)
      .withClaims(claims)
      .withPurpose('top level purpose')
      .build()
    const initiateAuthorize = await verifyidclient.initiateAuthorize(request)
    console.log(`code verifier: ${initiateAuthorize.codeVerifier}`)
    console.log(`click here: ${initiateAuthorize.redirectionUri}`)
  } catch (e) {
    console.error(e)
  }
}

async function tokenExample() {
  try {
    const verifyidclient = await VerifiedIdClient.createInstance({
      wellKnownURI: wellKnownUri,
      privateJWK: resolve('./secrets/quick-jobs.json'),
      clientId: 'IIvRB-z9e0mTVDfrXpAsy'
    })
    await verifyidclient.setUpClient()
    const request = new TokenRequestBuilder()
      .withRedirectURI('http://localhost:4201/profile')
      .withCodeVerifier('gekBHnGA5NLuX2z-fVNIrdpbPAFfUj0hthCwYPXji7d')
      .withCode('07G60dVyAmkUxcqI7YXd5TPwx2nA_GXhfLHWRxS69UG')
      .build()
    const token = await verifyidclient.token(request)
    console.log('token', token)
  } catch (e) {
    console.error(e)
  }
}
