import { BigNumber } from 'bignumber.js';
import { Numeric } from '../types';

export class Units {
  private constructor() {}

  /**
   * Parse from specific units and return a BigNumber
   * @param n number
   * @param decimals decimals
   */
  static parse(n: Numeric, decimals: number): BigNumber {
    return BigNumber(n).shiftedBy(decimals);
  }

  /**
   * Format in specific units and return a BigNumber
   * @param n number
   * @param decimals decimals
   */
  static format(n: Numeric, decimals: number): BigNumber {
    return BigNumber(n).shiftedBy(-decimals);
  }
}
