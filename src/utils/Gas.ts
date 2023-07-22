import { BigWrapper, BigWrapperSource } from './BigWrapper';

export type GasSource = BigWrapperSource<Gas>;

export class Gas extends BigWrapper<Gas> {
  static DEFAULT = Gas.tera(30);

  private constructor(n: GasSource) {
    super(n);
  }

  static from(n: GasSource): Gas {
    return new Gas(n);
  }

  protected override from(n: GasSource): Gas {
    return Gas.from(n);
  }

  /**
   * parse from tera units
   * @example
   * const rawGas = Gas.parse('5'); // Gas('5000000000000')
   * @param gas tera gas
   */
  static parse(gas: GasSource): Gas {
    return Gas.from(gas).shift(12).round(0);
  }

  /**
   * parse from tera units and fix to `string` type
   * @example
   * const rawGas = Gas.tera('5'); // '5000000000000'
   * @param gas tera gas
   */
  static tera(gas: GasSource): string {
    return Gas.parse(gas).toFixed();
  }
}
