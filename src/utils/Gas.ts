import { BigSource } from 'big.js';
import { BigWrapper } from './BigWrapper';

export class Gas extends BigWrapper<Gas> {
  static DEFAULT = Gas.tera(30);

  private constructor(n: BigSource) {
    super(n);
  }

  /**
   * construct a `Gas` instance
   * @param n
   */
  static from(n: BigSource): Gas {
    return new Gas(n);
  }

  protected from(n: BigSource): Gas {
    return Gas.from(n);
  }

  /**
   * parse from tera units
   * @example
   * const rawGas = Gas.parse('5'); // Gas('5000000000000')
   * @param gas tera gas
   */
  static parse(gas: BigSource): Gas {
    return Gas.from(gas).shift(12).round(0);
  }

  /**
   * parse from tera units and fix to `string` type
   * @example
   * const rawGas = Gas.tera('5'); // '5000000000000'
   * @param gas tera gas
   */
  static tera(gas: BigSource): string {
    return Gas.parse(gas).toFixed();
  }
}
