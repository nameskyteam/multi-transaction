import { BigNumber } from 'bignumber.js';
import { BigNumberish } from '../types';

export class Gas {
  static DEFAULT = Gas.tera(30);

  private constructor() {}

  /**
   * parse from tera units
   * @example
   * const rawGas = Gas.parse('5'); // BigNumber('5000000000000')
   * @param gas tera gas
   */
  static parse(gas: BigNumberish): BigNumber {
    return BigNumber(gas).shiftedBy(12).decimalPlaces(0);
  }

  /**
   * parse from tera units and fix to `string` type
   * @example
   * const rawGas = Gas.tera('5'); // '5000000000000'
   * @param gas tera gas
   */
  static tera(gas: BigNumberish): string {
    return Gas.parse(gas).toFixed();
  }
}
