import { IAL } from '../enums/ial'

export class Claim {
  private readonly _claimName: string
  private _purpose: string
  private _essential: boolean
  private _ial: IAL

  public constructor(claimName: string) {
    this._claimName = claimName
  }

  public get claimName() {
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
  public withPurpose(purpose: string): Claim {
    this._purpose = purpose
    return this
  }

  public withEssential(essential: boolean): Claim {
    this._essential = essential
    return this
  }

  public withIAL(ial: IAL): Claim {
    this._ial = ial
    return this
  }
}