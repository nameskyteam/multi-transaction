import { BigNumber } from 'bignumber.js';
import { BigNumberish } from '../types';

export class Gas {
  static TERA_DECIMALS = 12 as const;
  static GIGA_DECIMALS = 9 as const;

  // 30 Tera
  static DEFAULT = '30000000000000' as const;

  private constructor() {}

  /**
   * Parse from specific units.
   * @example
   * const rawGas = Gas.parse('5', 'tera'); // '5000000000000'
   * @param gas Human readable gas
   * @param units Units decimals
   */
  static parse(gas: BigNumberish, units: 'tera' | 'giga' | number): string {
    if (units === 'tera') {
      units = Gas.TERA_DECIMALS;
    } else if (units === 'giga') {
      units = Gas.GIGA_DECIMALS;
    }
    return BigNumber(gas).shiftedBy(units).toFixed(0);
  }
}
