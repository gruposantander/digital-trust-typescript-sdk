# Changelog

## 0.5.0

* Added ability for identifier
* Added `bank_account` claim
* Added `Identifier` enum

## 0.4.1

Added external publish details for github package

## 0.4.0

* Assertion language has removed all usages of `$`, now the syntax is:
  * eq
  * gt
  * gte
  * lt
  * lte
* Complex claims now contain a `props` field inside the claim, which contains the properties relating to the actual assertions being made. There are no changes in usage for a developer 

## 0.3.1

* Downgraded TypeScript to v3.5.3

### 0.3.0

* Adding the following claims:
  * gender
  * country_of_birth
  * title
  * nationality
  * civil_status
  * age
  * company_registered_name
  * company_trade_name
  * company_start_date
  * company_end_date
  * company_type
  * company_country_incorporation
  * company_age
  * company_operating
  * last_year_money_in
  * last_quarter_money_in
  * average_monthly_money_in
  * passport_id
  * driving_license_id
  * national_card_id
* Renaming `.equal` to `.eq`

### 0.2.1

* Fixing bug that didn't allow more than one sharing claim at a time

### 0.2.0

* First MVP, support for the following claims (sharing & verifying):
  * phone_number
  * email
  * family_name
  * given_name
  * birthdate
  * age
  * total_balance
  * address
