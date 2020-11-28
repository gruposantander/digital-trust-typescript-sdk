### Javascript/Typescript SDK for Santander Digital Trust Protocol

This is a plain JS/TS library, it doesn't rely on any specific framework. <br>
As such, it shouldn't have any compatibility issues with other frameworks.

#### How to use it

Import the dependency as a dependency
```
npm install @gruposantander/rp-client-typescript
```

The first step is to create the client and set it up:

```js
const verifyidclient = await VerifiedIdClient.createInstance({
  wellKnownURI: 'https://live.iamid.io/.well-known/openid-configuration',
  privateJWK: resolve('./secrets/privateKey.json'),
  clientId: '12345678-aaaa-bbbb-cccc-1234567890ab'
}) // creating the client
await verifyidclient.setUpClient() // running all the setup steps (querying the well-known endpoint and storing the public jwks)
```

After the step above, it is possible to initiate the flow straight away, by preparing the request and then send it:

```js
const claims = new Claims()
claims.email().withEssential(true).withPurpose('email purpose')
claims.givenName().withIAL(2)
claims.lastYearMoneyIn().withPurpose('Last year money in purpose')

const assertionClaims = new AssertionClaims()
assertionClaims.age().gt(21).withPurpose('age purpose')
assertionClaims.address()
  .withAssertion(Address.postalCode().eq('MK1 1AA'))
  .withAssertion(Address.country().eq('UK'))
  .withPurpose('Address purpose')

assertionClaims.lastYearMoneyIn()
  .withPurpose('Last year money in purpose')
  .withAssertion(Balance.amount().gt(200))

const request = new InitiateAuthorizeRequestBuilder()
  .withRedirectURI('com.myApp://callback')
  .withAssertionClaims(assertionClaims)
  .withClaims(claims)
  .withPurpose('top level purpose')
  .build()
```

While `InitiateAuthorizeRequestBuilder` follows a builder pattern, `Claims` and `AssertionClaims` use a different 
syntax to help readability

After the claims have been set up, the _/initiate-authorize_ can be invoked:

```js
const initiateAuthorizeResponse = await verifyidclient.initiateAuthorize(request)
```

From the above reponse, `initiateAuthorizeResponse.redirectionUri` can be used to redirect users to the consent journey:
```
https://live.iamid.io/web/login?request_uri=urn:op.iamid.io:JDAQ9YwMSLcCbiUz0Wq0HGjpu-wr4HngFDCv8tTkQa-
```
The consent process (happening in a browser, out of scope for this SDK) finishes with an authorization code:
```
302 com.myApp://callback?code=Ian06qtqg5PNUhfRUy9UFLwx4T7DIzodBLiFjoFYWmr
```
This code can then be used to invoke _/token_:

```js
const request = new TokenRequestBuilder()
  .withRedirectUri('com.myApp://callback')
  .withCode('Ian06qtqg5PNUhfRUy9UFLwx4T7DIzodBLiFjoFYWmr')
  .build()

const token = await verifyidclient.token(request)
```

## Supported Claims - Sharing
The following claims can be requested for sharing:
```js
const sharingClaims = new Claims()

sharingClaims.givenName()
sharingClaims.familyName()
sharingClaims.birthdate()
sharingClaims.gender()
sharingClaims.countryOfBirth()
sharingClaims.title()
sharingClaims.nationality()
sharingClaims.civilStatus()
sharingClaims.age()
sharingClaims.companyRegisteredName()
sharingClaims.companyTradeName()
sharingClaims.companyStartDate()
sharingClaims.companyEndDate()
sharingClaims.companyType()
sharingClaims.companyCountryIncorporation()
sharingClaims.companyAge()
sharingClaims.companyOperating()
sharingClaims.phoneNumber()
sharingClaims.email()
sharingClaims.address()
sharingClaims.totalBalance()
sharingClaims.lastYearMoneyIn()
sharingClaims.lastQuarterMoneyIn()
sharingClaims.averageMonthlyMoneyIn()
sharingClaims.passportId()
sharingClaims.drivingLicenseId()
sharingClaims.nationalCardId()
sharingClaims.bankAccount()
```

For each claim, a specific value _purpose_, _ial_ and/or _essential_ can be specified:
```js
sharingClaims.givenName().withPurpose("given name purpose").withIAL(3).withEssential(true)
sharingClaims.familyName().withIAL(TWO).withPurpose("family name purpose")
sharingClaims.birthdate().withEssential(false)
sharingClaims.gender()
```
None of these attributes are mandatory and they can be applied in any order

## Supported Claims - Verifying

The SDK supports the same verifying claims as it does for sharing, though the data model is quite different

There are three types of assertions in this SDK: _simple_, _comparative_ and _complex_.
 * *Simple assertions*:  they support only the ``.eq`` (equal assertion), e.g.
    ```js
    assertionClaims.email().eq("jane.doe@op-example.com")
    ```
   which translates into ``Verify that the email is "jane.doe@op-example.com"``
 * *Comparative assertions*: they extend _simple_ assertions with the ``.gt``, ``.gte``, ``.lt`` and ``.lte`` operations, e.g.:
   ```java
    assertionClaims.age().gte(18)
    ``` 
   which translates into ``Verify that the age is greater or equal than 18``
 * *Complex claims*: they include different properties, that can be individually asserted, for example:
    ```js
    assertionClaims.totalBalance()
        .withAssertion(Balance.currency().eq(Currency.getInstance("GBP")))
        .withAssertion(Balance.amount().gt(BigDecimal.valueOf(99.99)))
    ```
   which translates into ``Verify that the balance currency is equal to GBP and the amount is greater than 99.99``. 
   Depending on the individual claim, the property can either support only ``.eq`` or the entire set of comparisons 
 * *Identifier claims*: they include claims where you are asserting over an array of elements. In this instance, you can use the Identifiers of `every`, `some` and `none`. This has to added before making assertions, and currently only refers to the bankAccount claim:
    ```js
    assertionClaims.bankAccount()
        .withIdentifier(Identifier.SOME)
        .withAssertion(Account.identification().eq("045364575025984")
        .withAssertion(Account.type().eq("UK.SortCodeAccountNumber"))
    ```
  which translates into ``Verify that at least one of the bankAccount details has the properties of  an identification of 045364575025984, and type of UK.SortCodeAccountNumber``. 

Similarly to sharing claims, _purpose_, _ial_ and/or _essential_ can be attached to verifying claims:
```js
assertionClaims.address()
    .withAssertion(Address.country().eq("UK"))
    .withAssertion(Address.postalCode().eq("MK11AA"))
    .withPurpose("This is why RP is verifying your address")
```

To keep the API simple and concise, ``Balance``, ``Address`` and ``Account`` helpers have been created with the following methods:
```js
Balance.currency()
Balance.amount()
Address.formatted()
Address.streetAddress()
Address.postalCode()
Address.locality()
Address.region()
Address.country()
Account.type()
Account.identification()
```

## PKCE and nonce support
This SDK supports nonce verification and PKCE. Depending on the scenario one or both of them will be automatically enforced.
* Nonce: nonces can be passed as part of the ``InitiateAuthorizeRequest`` object:
   ```java
    const request = new InitiateAuthorizeRequestBuilder()
      .withRedirectURI('com.myApp://callback')
      .withAssertionClaims(assertionClaims)
      .withClaims(claims)
      .withPurpose('top level purpose')
      .withNonce('nonce-1111')
      .build()
    ```
    If such a value is not passed, the SDK will create one and will return it as part of the response object from the ``initiateAuthorize`` method.
    Regardless of whether the nonce is automatically or manually generated, such value will need to be passed when invoking the ``token`` method.
 * PKCE: similarly to nonce, a code challenge can be passed:
   ```java
   InitiateAuthorizeRequest request = InitiateAuthorizeRequest.builder()
       .redirectUri("https://example.com/callback")
       .claims(idClaims)
       .assertionClaims(assertionClaims)
       .codeChallenge("ii2ebegd173dg")
       .build()
   ```
   Different to the nonce case, a code verifier will be automatically generated (and the challenge calculated) if not passed to it *and* the redirectURI is a _deep link_. 
   If a challenge is passed or a verifier is generated, the verifier needs to be passed when invoking the ``token`` method:
   ```java
    TokenRequest tokenRequest = TokenRequest.builder()
        .redirectUri("com.myApp://callback")
        .authorizationCode("27IyhbWvL5uGY61f69A-RlEl7N2qRLm5vQ7_mO0tRGH")
        .codeVerifier("H-jwul2I2vbDb90ll-lfl14LXtES9lqZvgtiX3WYF44")
        .build()
    ```



