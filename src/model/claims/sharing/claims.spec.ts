import { Claims } from './claims'
import { IAL } from '../enums/ial'

describe('claims', () => {
  describe('email', () => {
    it('should add email claim if not already present', () => {
      const claims = new Claims()
      claims.email()
      expect(claims.claims).toHaveLength(1)
      expect(claims.claims[0]).toMatchObject({
        claimName: 'email',
      })
    })

    it('should add email with purpose claim if not already present', () => {
      const claims = new Claims()
      claims.email().withPurpose('my purpose')
      expect(claims.claims).toHaveLength(1)
      expect(claims.claims[0]).toMatchObject({
        claimName: 'email',
        purpose: 'my purpose'
      })
    })

    it('should replace email with purpose claim if not already present', () => {
      const claims = new Claims()
      claims.email().withPurpose('first purpose')
      claims.email().withPurpose('second purpose')
      expect(claims.claims).toHaveLength(1)
      expect(claims.claims[0]).toMatchObject({
        claimName: 'email',
        purpose: 'second purpose'
      })
    })

    it('should add email with essential claim if not already present', () => {
      const claims = new Claims()
      claims.email().withEssential(true)
      expect(claims.claims).toHaveLength(1)
      expect(claims.claims[0]).toMatchObject({
        claimName: 'email',
        essential: true
      })
    })

    it('shoudl add email with ial claim if not already present', () => {
      const claims = new Claims()
      claims.email().withIAL(IAL.ONE)
      expect(claims.claims).toHaveLength(1)
      expect(claims.claims[0]).toMatchObject({
        claimName: 'email',
        ial: 1
      })
    })
  })

  it('should add multiple claims - no repeats', () => {
    const claims = new Claims()
    claims.phoneNumber()
    claims.age()
    claims.birthdate()
    expect(claims.claims).toHaveLength(3)
    expect(claims.claims[0]).toMatchObject({ claimName: 'phone_number' })
    expect(claims.claims[1]).toMatchObject({ claimName: 'age' })
    expect(claims.claims[2]).toMatchObject({ claimName: 'birthdate' })
  })
  it('should add multiple claims - some repeats', () => {
    const claims = new Claims()
    claims.phoneNumber()
    claims.phoneNumber()
    claims.age()
    claims.age()
    claims.birthdate()
    expect(claims.claims).toHaveLength(3)
    expect(claims.claims[0]).toMatchObject({ claimName: 'phone_number' })
    expect(claims.claims[1]).toMatchObject({ claimName: 'age' })
    expect(claims.claims[2]).toMatchObject({ claimName: 'birthdate' })
  })
  it('phoneNumber should add phoneNumber claim if not already present', () => {
    const claims = new Claims()
    claims.phoneNumber()
    expect(claims.claims).toHaveLength(1)
    expect(claims.claims[0]).toMatchObject({
      claimName: 'phone_number',
    })
  })
  it('familyName should add familyName claim if not already present', () => {
    const claims = new Claims()
    claims.familyName()
    expect(claims.claims).toHaveLength(1)
    expect(claims.claims[0]).toMatchObject({
      claimName: 'family_name',
    })
  })
  it('givenName should add givenName claim if not already present', () => {
    const claims = new Claims()
    claims.givenName()
    expect(claims.claims).toHaveLength(1)
    expect(claims.claims[0]).toMatchObject({
      claimName: 'given_name',
    })
  })
  it('birthdate should add birthdate claim if not already present', () => {
    const claims = new Claims()
    claims.birthdate()
    expect(claims.claims).toHaveLength(1)
    expect(claims.claims[0]).toMatchObject({
      claimName: 'birthdate',
    })
  })
  it('age should add age claim if not already present', () => {
    const claims = new Claims()
    claims.age()
    expect(claims.claims).toHaveLength(1)
    expect(claims.claims[0]).toMatchObject({
      claimName: 'age',
    })
  })
  it('totalBalance should add totalBalance claim if not already present', () => {
    const claims = new Claims()
    claims.totalBalance()
    expect(claims.claims).toHaveLength(1)
    expect(claims.claims[0]).toMatchObject({
      claimName: 'total_balance',
    })
  })
  it('givenName should add givenName claim if not already present', () => {
    const claims = new Claims()
    claims.address()
    expect(claims.claims).toHaveLength(1)
    expect(claims.claims[0]).toMatchObject({
      claimName: 'address',
    })
  })

  it('gender should add gender claim if not already present', () => {
    const claims = new Claims()
    claims.gender()
    expect(claims.claims).toHaveLength(1)
    expect(claims.claims[0]).toMatchObject({
      claimName: 'gender',
    })
  })

  it('countryOfBirth should add countryOfBirth claim if not already present', () => {
    const claims = new Claims()
    claims.countryOfBirth()
    expect(claims.claims).toHaveLength(1)
    expect(claims.claims[0]).toMatchObject({
      claimName: 'country_of_birth',
    })
  })

  it('title should add title claim if not already present', () => {
    const claims = new Claims()
    claims.title()
    expect(claims.claims).toHaveLength(1)
    expect(claims.claims[0]).toMatchObject({
      claimName: 'title',
    })
  })

  it('nationality should add nationality claim if not already present', () => {
    const claims = new Claims()
    claims.nationality()
    expect(claims.claims).toHaveLength(1)
    expect(claims.claims[0]).toMatchObject({
      claimName: 'nationality',
    })
  })

  it('civilStatus should add civilStatus claim if not already present', () => {
    const claims = new Claims()
    claims.civilStatus()
    expect(claims.claims).toHaveLength(1)
    expect(claims.claims[0]).toMatchObject({
      claimName: 'civil_status',
    })
  })

  it('companyRegisteredName should add companyRegisteredName claim if not already present', () => {
    const claims = new Claims()
    claims.companyRegisteredName()
    expect(claims.claims).toHaveLength(1)
    expect(claims.claims[0]).toMatchObject({
      claimName: 'company_registered_name',
    })
  })

  it('companyTradeName should add companyTradeName claim if not already present', () => {
    const claims = new Claims()
    claims.companyTradeName()
    expect(claims.claims).toHaveLength(1)
    expect(claims.claims[0]).toMatchObject({
      claimName: 'company_trade_name',
    })
  })

  it('companyStartDate should add companyStartDate claim if not already present', () => {
    const claims = new Claims()
    claims.companyStartDate()
    expect(claims.claims).toHaveLength(1)
    expect(claims.claims[0]).toMatchObject({
      claimName: 'company_start_date',
    })
  })

  it('companyEndDate should add companyEndDate claim if not already present', () => {
    const claims = new Claims()
    claims.companyEndDate()
    expect(claims.claims).toHaveLength(1)
    expect(claims.claims[0]).toMatchObject({
      claimName: 'company_end_date',
    })
  })

  it('companyType should add companyType claim if not already present', () => {
    const claims = new Claims()
    claims.companyType()
    expect(claims.claims).toHaveLength(1)
    expect(claims.claims[0]).toMatchObject({
      claimName: 'company_type',
    })
  })

  it('companyCountryIncorporation should add companyCountryIncorporation claim if not already present', () => {
    const claims = new Claims()
    claims.companyCountryIncorporation()
    expect(claims.claims).toHaveLength(1)
    expect(claims.claims[0]).toMatchObject({
      claimName: 'company_country_incorporation',
    })
  })

  it('companyAge should add companyAge claim if not already present', () => {
    const claims = new Claims()
    claims.companyAge()
    expect(claims.claims).toHaveLength(1)
    expect(claims.claims[0]).toMatchObject({
      claimName: 'company_age',
    })
  })

  it('companyOperating should add companyOperating claim if not already present', () => {
    const claims = new Claims()
    claims.companyOperating()
    expect(claims.claims).toHaveLength(1)
    expect(claims.claims[0]).toMatchObject({
      claimName: 'company_operating',
    })
  })

  it('lastYearMoneyIn should add lastYearMoneyIn claim if not already present', () => {
    const claims = new Claims()
    claims.lastYearMoneyIn()
    expect(claims.claims).toHaveLength(1)
    expect(claims.claims[0]).toMatchObject({
      claimName: 'last_year_money_in',
    })
  })

  it('lastQuarterMoneyIn should add lastQuarterMoneyIn claim if not already present', () => {
    const claims = new Claims()
    claims.lastQuarterMoneyIn()
    expect(claims.claims).toHaveLength(1)
    expect(claims.claims[0]).toMatchObject({
      claimName: 'last_quarter_money_in',
    })
  })

  it('averageMonthlyMoneyIn should add averageMonthlyMoneyIn claim if not already present', () => {
    const claims = new Claims()
    claims.averageMonthlyMoneyIn()
    expect(claims.claims).toHaveLength(1)
    expect(claims.claims[0]).toMatchObject({
      claimName: 'average_monthly_money_in',
    })
  })

  it('passportId should add passportId claim if not already present', () => {
    const claims = new Claims()
    claims.passportId()
    expect(claims.claims).toHaveLength(1)
    expect(claims.claims[0]).toMatchObject({
      claimName: 'passport_id',
    })
  })

  it('drivingLicenseId should add drivingLicenseId claim if not already present', () => {
    const claims = new Claims()
    claims.drivingLicenseId()
    expect(claims.claims).toHaveLength(1)
    expect(claims.claims[0]).toMatchObject({
      claimName: 'driving_license_id',
    })
  })

  it('nationalCardId should add nationalCardId claim if not already present', () => {
    const claims = new Claims()
    claims.nationalCardId()
    expect(claims.claims).toHaveLength(1)
    expect(claims.claims[0]).toMatchObject({
      claimName: 'national_card_id',
    })
  })

  it('should add bank_account claim if not already present', () => {
    const claims = new Claims()
    claims.bankAccount()
    expect(claims.claims).toHaveLength(1)
    expect(claims.claims[0]).toMatchObject({
      claimName: 'bank_account',
    })
  })
})
