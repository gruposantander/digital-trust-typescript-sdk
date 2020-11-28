import { AssertionClaimComplex } from './assertion-claim-complex'
import { Identifier } from '../enums/identifier'

export class AssertionClaimIdentifier extends AssertionClaimComplex {
    private _identifier: string
    public get identifier(): string {
        return this._identifier
    }

    public withIdentifier(identifier: Identifier): AssertionClaimIdentifier {
        this._identifier = identifier
        return this
    }
}