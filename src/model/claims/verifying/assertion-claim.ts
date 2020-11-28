import { IAL } from '../enums/ial'

export class AssertionClaim {
  private readonly _claimName: string
  private _purpose: string
  private _essential: boolean
  private _ial: IAL

  public constructor(claimName: string) {
    this._claimName = claimName
  }

  public get claimName(): string {
    return this._claimName
  }

  public get purpose(): string {
    return this._purpose
  }
  public get essential(): boolean {
    return this._essential
  }

  public get ial(): IAL {
    return this._ial
  }

  public withPurpose(purpose: string): AssertionClaim {
    this._purpose = purpose
    return this
  }

  public withEssential(essential: boolean): AssertionClaim {
    this._essential = essential
    return this
  }

  public withIAL(ial: IAL): AssertionClaim {
    this._ial = ial
    return this
  }
}
