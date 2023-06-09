import { BigWrapper, BigWrapperSource } from './BigWrapper';

export class Gas extends BigWrapper<Gas> {
  static DEFAULT = Gas.tera(30);

  private constructor(n: BigWrapperSource<Gas>) {
    super(n);
  }

  /**
   * construct a `Gas` instance
   * @param n
   */
  static from(n: BigWrapperSource<Gas>): Gas {
    return new Gas(n);
  }

  protected from(n: BigWrapperSource<Gas>): Gas {
    return Gas.from(n);
  }

  /**
   * parse from tera units
   * @example
   * const rawGas = Gas.parse('5'); // Gas('5000000000000')
   * @param gas tera gas
   */
  static parse(gas: BigWrapperSource<Gas>): Gas {
    return Gas.from(gas).shift(12).round(0);
  }

  /**
   * parse from tera units and fix to `string` type
   * @example
   * const rawGas = Gas.tera('5'); // '5000000000000'
   * @param gas tera gas
   */
  static tera(gas: BigWrapperSource<Gas>): string {
    return Gas.parse(gas).toFixed();
  }
}
