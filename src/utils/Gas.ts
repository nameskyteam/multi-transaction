import { BigNumber } from 'bignumber.js';
import { BigNumberish } from '../types';

export class Gas {
  static DEFAULT = Gas.parse(30, 'tera');
  static TERA_DECIMALS = 12 as const;
  static GIGA_DECIMALS = 9 as const;

  private constructor() {}

  /**
   * Parse from specific units.
   * @example
   * const rawGas = Gas.parse('5', Gas.TERA_DECIMALS); // BigNumber('5000000000000')
   * @param gas Human readable gas
   * @param units Units decimals
   */
  static parse(gas: BigNumberish, units: number): BigNumber;
  /**
   * Parse from Tera or Giga units.
   * @example
   * const rawGas = Gas.parse('5', 'tera'); // '5000000000000'
   * @param gas Human readable gas
   * @param units Tera or Giga units
   */
  static parse(gas: BigNumberish, units: 'tera' | 'giga'): string;
  static parse(gas: BigNumberish, units: number | 'tera' | 'giga'): BigNumber | string;
  static parse(gas: BigNumberish, units: number | 'tera' | 'giga'): BigNumber | string {
    if (units === 'tera') {
      return BigNumber(gas).shiftedBy(Gas.TERA_DECIMALS).toFixed(0);
    } else if (units === 'giga') {
      return BigNumber(gas).shiftedBy(Gas.GIGA_DECIMALS).toFixed(0);
    } else {
      return BigNumber(gas).shiftedBy(units).decimalPlaces(0);
    }
  }
}
