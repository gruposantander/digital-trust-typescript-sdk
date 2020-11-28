import { Constants } from '../../../test-resources/constants'
import { IAL } from '../enums/ial'
import { Account } from './account'
import { Address } from './address'
import { AssertionClaims } from './assertion-claims'
import { Balance } from '../enums/balance'
import { Identifier } from '../enums/identifier'
import { Operator } from './operator'

let claims: AssertionClaims

describe('assertion claims', () => {
  beforeEach(() => {
    claims = new AssertionClaims()
  })

  describe('simple claims', () => {
    describe('email', () => {
      it('should add email claim if not already present', () => {
        claims.email().equal('john.doe@op-example.com')
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'email',
          _operand: 'john.doe@op-example.com',
          _operator: 'eq'
        })
      })
      it('should add email with _purpose claim if not already present', () => {
        claims.email().equal('john.doe@op-example.com').withPurpose('my purpose')
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'email',
          _operand: 'john.doe@op-example.com',
          _operator: 'eq',
          _purpose: 'my purpose'
        })
      })
      it('should replace email claim if already present', () => {
        claims.email().equal('john.doe@op-example.com')
        claims.email().equal('john.smith@op-example.com')
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'email',
          _operand: 'john.smith@op-example.com',
          _operator: 'eq'
        })
      })
      it('should add email with essential claim if not already present', () => {
        claims.email().equal('john.doe@op-example.com').withEssential(true)
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'email',
          _operand: 'john.doe@op-example.com',
          _operator: 'eq',
          _essential: true
        })
      })
      it('should add email with ial claim if not already present', () => {
        claims.email().equal('john.doe@op-example.com').withIAL(IAL.THREE)
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'email',
          _operand: 'john.doe@op-example.com',
          _operator: 'eq',
          _ial: 3
        })
      })
    })
    describe('other simple claims', () => {
      it('should add phoneNumber claim if not already present', () => {
        claims.phoneNumber().equal('+447777777777')
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'phone_number',
          _operand: '+447777777777',
          _operator: 'eq'
        })
      })
      it('should add familyName claim if not already present', () => {
        claims.familyName().equal('smith')
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'family_name',
          _operand: 'smith',
          _operator: 'eq'
        })
      })
      it('should add givenName claim if not already present', () => {
        claims.givenName().equal('smith')
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'given_name',
          _operand: 'smith',
          _operator: 'eq'
        })
      })

      it('should add gender claim if not already present', () => {
        claims.gender().equal('female')
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'gender',
          _operand: 'female',
          _operator: 'eq'
        })
      })

      it('should add countryOfBirth claim if not already present', () => {
        claims.countryOfBirth().equal('UK')
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'country_of_birth',
          _operand: 'UK',
          _operator: 'eq'
        })
      })

      it('should add title claim if not already present', () => {
        claims.title().equal('Dr')
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'title',
          _operand: 'Dr',
          _operator: 'eq'
        })
      })

      it('should add nationality claim if not already present', () => {
        claims.nationality().equal('British')
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'nationality',
          _operand: 'British',
          _operator: 'eq'
        })
      })

      it('should add civilStatus claim if not already present', () => {
        claims.civilStatus().equal('married')
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'civil_status',
          _operand: 'married',
          _operator: 'eq'
        })
      })

      it('should add companyRegisteredName claim if not already present', () => {
        claims.companyRegisteredName().equal('Acme Associates')
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'company_registered_name',
          _operand: 'Acme Associates',
          _operator: 'eq'
        })
      })

      it('should add companyTradeName claim if not already present', () => {
        claims.companyTradeName().equal('Acme')
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'company_trade_name',
          _operand: 'Acme',
          _operator: 'eq'
        })
      })

      it('should add companyType claim if not already present', () => {
        claims.companyType().equal('Sole Trader')
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'company_type',
          _operand: 'Sole Trader',
          _operator: 'eq'
        })
      })

      it('should add companyCountryIncorporation claim if not already present', () => {
        claims.companyCountryIncorporation().equal('UK')
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'company_country_incorporation',
          _operand: 'UK',
          _operator: 'eq'
        })
      })

      it('should add companyOperating claim if not already present', () => {
        claims.companyOperating().equal(true)
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'company_operating',
          _operand: true,
          _operator: 'eq'
        })
      })

      it('should add passportId claim if not already present', () => {
        claims.passportId().equal('YA1111111')
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'passport_id',
          _operand: 'YA1111111',
          _operator: 'eq'
        })
      })

      it('should add drivingLicenseId claim if not already present', () => {
        claims.drivingLicenseId().equal('JONES111222AB33C12')
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'driving_license_id',
          _operand: 'JONES111222AB33C12',
          _operator: 'eq'
        })
      })
      it('should add nationalCardId claim if not already present', () => {
        claims.nationalCardId().equal('AA11111111')
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'national_card_id',
          _operand: 'AA11111111',
          _operator: 'eq'
        })
      })

      it('should add givenName with _purpose and email with purpose when neither are present', () => {
        claims.givenName().equal('Smith').withPurpose('name purpose')
        claims.email().equal('john.doe@op-example.com').withPurpose('email purpose')
        expect(claims.claims).toHaveLength(2)
        expect(claims.claims).toMatchObject([{
          _claimName: 'given_name',
          _operand: 'Smith',
          _operator: 'eq',
          _purpose: 'name purpose'
        }, {
          _claimName: 'email',
          _operand: 'john.doe@op-example.com',
          _operator: 'eq',
          _purpose: 'email purpose'
        }])
      })
    })
  })
  describe('comparator claims', () => {
    describe('age', () => {
      it('should add age claim with eq operator if not already present', () => {
        claims.age().equal(102)
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'age',
          _operand: 102,
          _operator: 'eq'
        })
      })
      it('should add age claim with gt operator if not already present', () => {
        claims.age().gt(102)
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'age',
          _operand: 102,
          _operator: 'gt'
        })
      })
      it('should add age claim with gte _operator if not already present', () => {
        claims.age().gte(102)
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'age',
          _operand: 102,
          _operator: 'gte'
        })
      })
      it('should add age claim with lt operator if not already present', () => {
        claims.age().lt(102)
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'age',
          _operand: 102,
          _operator: 'lt'
        })
      })
      it('should add age claim with lte operator if not already present', () => {
        claims.age().lte(102)
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'age',
          _operand: 102,
          _operator: 'lte'
        })
      })
      it('should replace age claim with eq operator if already present', () => {
        claims.age().equal(102)
        claims.age().equal(103)
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'age',
          _operand: 103,
          _operator: 'eq'
        })
      })
    })
    describe('other comparator claims', () => {
      it('should add birthdate claim with eq operator if not already present', () => {
        claims.birthdate().equal(Constants.DATE_28_FEB_2002)
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'birthdate',
          _operand: Constants.DATE_28_FEB_2002,
          _operator: 'eq'
        })
      })

      it('should add email with purpose and birthdate with purpose when neither are present', () => {
        claims.email().equal('john.doe@op-example.com').withPurpose('email purpose')
        claims.birthdate().equal(Constants.DATE_28_FEB_2002).withPurpose('birthdate purpose')
        expect(claims.claims).toHaveLength(2)
        expect(claims.claims).toMatchObject([{
          _claimName: 'email',
          _operand: 'john.doe@op-example.com',
          _operator: 'eq',
          _purpose: 'email purpose'
        }, {
          _claimName: 'birthdate',
          _operand: Constants.DATE_28_FEB_2002,
          _operator: 'eq',
          _purpose: 'birthdate purpose'
        }])
      })

      it('should add companyStartDate claim if not already present', () => {
        claims.companyStartDate().lt(Constants.DATE_28_FEB_2002)
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'company_start_date',
          _operand: Constants.DATE_28_FEB_2002,
          _operator: 'lt'
        })
      })

      it('should add companyEndDate claim if not already present', () => {
        claims.companyEndDate().gt(Constants.DATE_28_FEB_2002)
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'company_end_date',
          _operand: Constants.DATE_28_FEB_2002,
          _operator: 'gt'
        })
      })
      it('should add companyAge claim if not already present', () => {
        claims.companyAge().gt(10)
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'company_age',
          _operand: 10,
          _operator: 'gt'
        })
      })
    })
  })
  describe('complex claims', () => {
    describe('balance', () => {
      it('should add total balance claim with amount and currency if not already present', () => {
        claims.totalBalance()
          .withAssertion(Balance.amount().eq(101.12))
          .withAssertion(Balance.currency().eq('GBP'))
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'total_balance',
          _properties: [newProperty('amount', 101.12, Operator.EQUAL), newProperty('currency', 'GBP', Operator.EQUAL)]
        })
      })

      it('should add total balance (gt) claim with amount and currency if not already present', () => {
        claims.totalBalance()
          .withAssertion(Balance.amount().gt(101.12))
          .withAssertion(Balance.currency().eq('GBP'))
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'total_balance',
          _properties: [newProperty('amount', 101.12, Operator.GREATER_THAN), newProperty('currency', 'GBP', Operator.EQUAL)]
        })
      })

      it('should add total balance (lt) claim with amount and currency if not already present', () => {
        claims.totalBalance()
          .withAssertion(Balance.amount().lt(101.12))
          .withAssertion(Balance.currency().eq('GBP'))
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'total_balance',
          _properties: [newProperty('amount', 101.12, Operator.LESS_THAN), newProperty('currency', 'GBP', Operator.EQUAL)]
        })
      })

      it('should add total balance (lte) claim with amount and currency if not already present', () => {
        claims.totalBalance()
          .withAssertion(Balance.amount().lte(101.12))
          .withAssertion(Balance.currency().eq('GBP'))
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'total_balance',
          _properties: [newProperty('amount', 101.12, Operator.LESS_THAN_OR_EQUAL), newProperty('currency', 'GBP', Operator.EQUAL)]
        })
      })

      it('should add total balance claim with amount operator and currency if not already present', () => {
        claims.totalBalance()
          .withAssertion(Balance.amount().gte(101.12))
          .withAssertion(Balance.currency().eq('GBP'))
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'total_balance',
          _properties: [newProperty('amount', 101.12, Operator.GREATER_THAN_OR_EQUAL), newProperty('currency', 'GBP', Operator.EQUAL)]
        })
      })

      it('should add total balance claim with amount and currency if already present', () => {
        claims.totalBalance()
          .withAssertion(Balance.amount().eq(99.12))
          .withAssertion(Balance.currency().eq('EUR'))
        claims.totalBalance()
          .withAssertion(Balance.amount().eq(101.12))
          .withAssertion(Balance.currency().eq('GBP'))
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'total_balance',
          _properties: [newProperty('amount', 101.12, Operator.EQUAL), newProperty('currency', 'GBP', Operator.EQUAL)]
        })
      })

      it('should add lastYearMoneyIn claim if not already present', () => {
        claims.lastYearMoneyIn()
          .withAssertion(Balance.amount().gt(101.12))
          .withAssertion(Balance.currency().eq('GBP'))
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'last_year_money_in',
          _properties: [newProperty('amount', 101.12, Operator.GREATER_THAN), newProperty('currency', 'GBP', Operator.EQUAL)]
        })
      })

      it('should add lastQuarterMoneyIn claim if not already present', () => {
        claims.lastQuarterMoneyIn()
          .withAssertion(Balance.amount().gt(101.12))
          .withAssertion(Balance.currency().eq('GBP'))
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'last_quarter_money_in',
          _properties: [newProperty('amount', 101.12, Operator.GREATER_THAN), newProperty('currency', 'GBP', Operator.EQUAL)]
        })
      })

      it('should add averageMonthlyMoneyIn claim if not already present', () => {
        claims.averageMonthlyMoneyIn()
          .withAssertion(Balance.amount().gt(101.12))
          .withAssertion(Balance.currency().eq('GBP'))
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'average_monthly_money_in',
          _properties: [newProperty('amount', 101.12, Operator.GREATER_THAN), newProperty('currency', 'GBP', Operator.EQUAL)]
        })
      })
    })

    describe('address', () => {
      it('should add address claim with formatted if not already present', () => {
        claims.address()
          .withAssertion(Address.formatted().eq('1 Bag End format'))
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'address',
          _properties: [newProperty('formatted', '1 Bag End format', Operator.EQUAL)]
        })
      })

      it('should add address claim with street_address if not already present', () => {
        claims.address()
          .withAssertion(Address.streetAddress().eq('1 Bag End'))
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'address',
          _properties: [newProperty('street_address', '1 Bag End', Operator.EQUAL)]
        })
      })

      it('should add address claim with locality if not already present', () => {
        claims.address()
          .withAssertion(Address.locality().eq('Milton Keynes'))
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'address',
          _properties: [newProperty('locality', 'Milton Keynes', Operator.EQUAL)]
        })
      })

      it('should add address claim with region if not already present', () => {
        claims.address()
          .withAssertion(Address.region().eq('Bucks'))
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'address',
          _properties: [newProperty('region', 'Bucks', Operator.EQUAL)]
        })
      })

      it('should add address claim with postal code if not already present', () => {
        claims.address()
          .withAssertion(Address.postalCode().eq('MK1 1AA'))
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'address',
          _properties: [newProperty('postal_code', 'MK1 1AA', Operator.EQUAL)]
        })
      })

      it('should add address claim with country if not already present', () => {
        claims.address()
          .withAssertion(Address.country().eq('UK'))
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'address',
          _properties: [newProperty('country', 'UK', Operator.EQUAL)]
        })
      })

      it('should add address claim if already present', () => {
        claims.address()
          .withAssertion(Address.postalCode().eq('MK1 1AA'))
        claims.address()
          .withAssertion(Address.country().eq('UK'))
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'address',
          _properties: [newProperty('country', 'UK', Operator.EQUAL)]
        })
      })

      it('should add address claim with all fields if not already present', () => {
        claims.address()
          .withAssertion(Address.formatted().eq('test formatted'))
          .withAssertion(Address.streetAddress().eq('test street_address'))
          .withAssertion(Address.locality().eq('test locality'))
          .withAssertion(Address.region().eq('test region'))
          .withAssertion(Address.postalCode().eq('test postal_code'))
          .withAssertion(Address.country().eq('test country'))
        expect(claims.claims).toHaveLength(1)
        expect(claims.claims[0]).toMatchObject({
          _claimName: 'address',
          _properties: [
            newProperty('formatted', 'test formatted', Operator.EQUAL),
            newProperty('street_address', 'test street_address', Operator.EQUAL),
            newProperty('locality', 'test locality', Operator.EQUAL),
            newProperty('region', 'test region', Operator.EQUAL),
            newProperty('postal_code', 'test postal_code', Operator.EQUAL),
            newProperty('country', 'test country', Operator.EQUAL)
          ]
        })
      })

      it('should add total balance claim with amount and currency, and address with  if already present', () => {
        claims.totalBalance()
          .withAssertion(Balance.amount().gte(101.12))
        claims.address()
          .withAssertion(Address.postalCode().eq('MK1 1AA'))
        expect(claims.claims).toHaveLength(2)
        expect(claims.claims).toMatchObject([
          {
            _claimName: 'total_balance',
            _properties: [newProperty('amount', 101.12, Operator.GREATER_THAN_OR_EQUAL)]
          }, {
            _claimName: 'address',
            _properties: [newProperty('postal_code', 'MK1 1AA', Operator.EQUAL)]
          }])
      })
    })

    describe('bank_account', () => {
      describe('withIdentifier', () => {
        it('should add bank account with identification if not already present', () => {
          claims.bankAccount()
            .withIdentifier(Identifier.SOME)
            .withAssertion(Account.identification().eq('124039503031'))

          expect(claims.claims).toHaveLength(1)
          expect(claims.claims).toMatchObject([
            {
              _claimName: 'bank_account',
              _identifier: 'some',
              _properties: [newProperty('identification', '124039503031', Operator.EQUAL)]
            }])
        })

        it('should add bank account with type if not already present', () => {
          claims.bankAccount()
            .withIdentifier(Identifier.NONE)
            .withAssertion(Account.type().eq('UK.SortCodeAccountNumber'))
          expect(claims.claims).toHaveLength(1)
          expect(claims.claims).toMatchObject([
            {
              _claimName: 'bank_account',
              _identifier: 'none',
              _properties: [newProperty('type', 'UK.SortCodeAccountNumber', Operator.EQUAL)]
            }])
        })
      })
    })
  })

  function newProperty(_propertyName: string, _operand: (string | number), _operator: Operator): { _propertyName: string; _operand: (string | number); _operator: string } {
    return {
      _propertyName,
      _operand,
      _operator
    }
  }
})
