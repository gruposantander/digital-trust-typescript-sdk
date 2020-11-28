import { Claims } from './model/claims/sharing/claims'
import { AssertionClaims } from './model/claims/verifying/assertion-claims'
import { Address } from './model/claims/verifying/address'
import { Balance } from './model/claims/enums/balance'
import { VerifiedIdClient } from './verifyidclient'
import { InitiateAuthorizeRequestBuilder } from './model/initiate-authorize-requestBuilder'
import { TokenRequestBuilder } from './model/token/token-requestBuilder'
import { Account } from './model/claims/verifying/account'
import { Identifier } from './model/claims/enums/identifier'

export const Model = {
  Claims,
  AssertionClaims,
  Balance,
  Address,
  Account,
  Identifier
}

export const Client = {
  VerifiedIdClient,
  InitiateAuthorizeRequestBuilder,
  TokenRequestBuilder
}