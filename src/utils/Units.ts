import { BigNumber } from 'bignumber.js';
import { BigNumberish } from '../types';

export class Units {
  private constructor() {}

  /**
   * Parse from specific units and return a fixed string.
   * @param n Number
   * @param decimals Units decimals
   */
  static parse(n: BigNumberish, decimals: number): string {
    return Units.parseBigNumber(n, decimals).toFixed();
  }

  /**
   * Parse from specific units and return a BigNumber.
   * @param n Number
   * @param decimals Units decimals
   */
  static parseBigNumber(n: BigNumberish, decimals: number): BigNumber {
    return BigNumber(n).shiftedBy(decimals).decimalPlaces(0);
  }

  /**
   * Format in specific units and return a fixed string.
   * @param n Number
   * @param decimals Units decimals
   * @param decimalPlaces Decimal places
   */
  static format(n: BigNumberish, decimals: number, decimalPlaces?: number): string {
    n = Units.formatBigNumber(n, decimals);
    if (decimalPlaces) {
      return n.toFixed(decimalPlaces);
    } else {
      return n.toFixed();
    }
  }

  /**
   * Format in specific units and return a BigNumber.
   * @param n Number
   * @param decimals Units decimals
   */
  static formatBigNumber(n: BigNumberish, decimals: number): BigNumber {
    return BigNumber(n).shiftedBy(-decimals);
  }
}
