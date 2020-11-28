import { AssertionClaim } from './assertion-claim'
import { AssertionClaimComparator } from './assertion-claim-comparator'
import { AssertionClaimComplex } from './assertion-claim-complex'
import { AssertionClaimSimple } from './assertion-claim-simple'
import { AssertionClaimIdentifier } from './assertion-claim-identifier'

export class AssertionClaims {
  private readonly _claims: AssertionClaim[] = []

  public get claims(): AssertionClaim[] {
    return this._claims
  }

  public email(): AssertionClaimSimple<string> {
    return this.addAssertionClaimSimple<string>('email')
  }

  public phoneNumber(): AssertionClaimSimple<string> {
    return this.addAssertionClaimSimple<string>('phone_number')
  }

  public familyName(): AssertionClaimSimple<string> {
    return this.addAssertionClaimSimple<string>('family_name')
  }

  public givenName(): AssertionClaimSimple<string> {
    return this.addAssertionClaimSimple<string>('given_name')
  }

  public age(): AssertionClaimComparator<number> {
    return this.addAssertionClaimComparator<number>('age')
  }

  public gender(): AssertionClaimSimple<string> {
    return this.addAssertionClaimSimple<string>('gender')
  }

  public countryOfBirth(): AssertionClaimSimple<string> {
    return this.addAssertionClaimSimple<string>('country_of_birth')
  }

  public title(): AssertionClaimSimple<string> {
    return this.addAssertionClaimSimple<string>('title')
  }

  public nationality(): AssertionClaimSimple<string> {
    return this.addAssertionClaimSimple<string>('nationality')
  }

  public civilStatus(): AssertionClaimSimple<string> {
    return this.addAssertionClaimSimple<string>('civil_status')
  }

  public companyRegisteredName(): AssertionClaimSimple<string> {
    return this.addAssertionClaimSimple<string>('company_registered_name')
  }

  public companyTradeName(): AssertionClaimSimple<string> {
    return this.addAssertionClaimSimple<string>('company_trade_name')
  }

  public companyStartDate(): AssertionClaimComparator<Date> {
    return this.addAssertionClaimComparator<Date>('company_start_date')
  }

  public companyEndDate(): AssertionClaimComparator<Date> {
    return this.addAssertionClaimComparator<Date>('company_end_date')
  }

  public companyType(): AssertionClaimSimple<string> {
    return this.addAssertionClaimSimple<string>('company_type')
  }

  public companyCountryIncorporation(): AssertionClaimSimple<string> {
    return this.addAssertionClaimSimple<string>('company_country_incorporation')
  }

  public companyAge(): AssertionClaimComparator<number> {
    return this.addAssertionClaimComparator<number>('company_age')
  }

  public companyOperating(): AssertionClaimSimple<boolean> {
    return this.addAssertionClaimSimple<boolean>('company_operating')
  }

  public birthdate(): AssertionClaimComparator<Date> {
    return this.addAssertionClaimComparator<Date>('birthdate')
  }

  public totalBalance(): AssertionClaimComplex {
    return this.addAssertionClaimComplex('total_balance')
  }

  public address(): AssertionClaimComplex {
    return this.addAssertionClaimComplex('address')
  }

  public lastYearMoneyIn(): AssertionClaimComplex {
    return this.addAssertionClaimComplex('last_year_money_in')
  }

  public lastQuarterMoneyIn(): AssertionClaimComplex {
    return this.addAssertionClaimComplex('last_quarter_money_in')
  }

  public averageMonthlyMoneyIn(): AssertionClaimComplex {
    return this.addAssertionClaimComplex('average_monthly_money_in')
  }

  public passportId(): AssertionClaimSimple<string> {
    return this.addAssertionClaimSimple<string>('passport_id')
  }

  public drivingLicenseId(): AssertionClaimSimple<string> {
    return this.addAssertionClaimSimple<string>('driving_license_id')
  }

  public nationalCardId(): AssertionClaimSimple<string> {
    return this.addAssertionClaimSimple<string>('national_card_id')
  }

  public bankAccount(): AssertionClaimIdentifier {
    return this.addAssertionClaimIdentifier('bank_account')
  }

  private addAssertionClaimSimple<T>(claimName: string): AssertionClaimSimple<T> {
    const claim = new AssertionClaimSimple<T>(claimName)
    this.addClaim(claimName, claim)
    return claim
  }

  private addAssertionClaimComparator<T>(claimName: string): AssertionClaimComparator<T> {
    const claim = new AssertionClaimComparator<T>(claimName)
    this.addClaim(claimName, claim)
    return claim
  }

  private addAssertionClaimComplex(claimName: string): AssertionClaimComplex {
    const claim = new AssertionClaimComplex(claimName)
    this.addClaim(claimName, claim)
    return claim
  }

  private addAssertionClaimIdentifier(claimName: string): AssertionClaimIdentifier {
    const claim = new AssertionClaimIdentifier(claimName)
    this.addClaim(claimName, claim)
    return claim
  }

  private addClaim(claimName: string, claim: any) {
    const existingClaimIndex = this._claims.findIndex(cl => cl.claimName === claimName)
    if (existingClaimIndex > -1) {
      this._claims.splice(existingClaimIndex, 1)
    }
    this._claims.push(claim)
  }
}
