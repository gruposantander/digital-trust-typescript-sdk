import { Claim } from './claim'

export class Claims {
  private readonly _claims: Claim[] = []

  get claims() {
    return this._claims
  }

  public phoneNumber(): Claim {
    return this.addClaim('phone_number')
  }

  public email(): Claim {
    return this.addClaim('email')
  }

  public familyName(): Claim {
    return this.addClaim('family_name')
  }

  public givenName(): Claim {
    return this.addClaim('given_name')
  }

  public birthdate(): Claim {
    return this.addClaim('birthdate')
  }

  public age(): Claim {
    return this.addClaim('age')
  }

  public totalBalance(): Claim {
    return this.addClaim('total_balance')
  }

  public address(): Claim {
    return this.addClaim('address')
  }

  public gender(): Claim {
    return this.addClaim('gender')
  }

  public countryOfBirth(): Claim {
    return this.addClaim('country_of_birth')
  }

  public title(): Claim {
    return this.addClaim('title')
  }

  public nationality(): Claim {
    return this.addClaim('nationality')
  }

  public civilStatus(): Claim {
    return this.addClaim('civil_status')
  }

  public companyRegisteredName(): Claim {
    return this.addClaim('company_registered_name')
  }

  public companyTradeName(): Claim {
    return this.addClaim('company_trade_name')
  }

  public companyStartDate(): Claim {
    return this.addClaim('company_start_date')
  }

  public companyEndDate(): Claim {
    return this.addClaim('company_end_date')
  }

  public companyType(): Claim {
    return this.addClaim('company_type')
  }

  public companyCountryIncorporation(): Claim {
    return this.addClaim('company_country_incorporation')
  }

  public companyAge(): Claim {
    return this.addClaim('company_age')
  }

  public companyOperating(): Claim {
    return this.addClaim('company_operating')
  }

  public lastYearMoneyIn(): Claim {
    return this.addClaim('last_year_money_in')
  }

  public lastQuarterMoneyIn(): Claim {
    return this.addClaim('last_quarter_money_in')
  }

  public averageMonthlyMoneyIn(): Claim {
    return this.addClaim('average_monthly_money_in')
  }

  public passportId(): Claim {
    return this.addClaim('passport_id')
  }

  public drivingLicenseId(): Claim {
    return this.addClaim('driving_license_id')
  }

  public nationalCardId(): Claim {
    return this.addClaim('national_card_id')
  }

  public bankAccount(): Claim {
    return this.addClaim('bank_account')
  }

  private addClaim(claimName: string): Claim {
    const claim = new Claim(claimName)
    const existingClaimIndex = this._claims.findIndex(cl => cl.claimName === claimName)
    if (existingClaimIndex >= 0) {
      this._claims.splice(existingClaimIndex, 1)
    }
    this._claims.push(claim)
    return claim
  }
}