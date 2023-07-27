import { BigNumber } from 'bignumber.js';
import { BigNumberish } from '../types';

export class Units {
  private constructor() {}

  /**
   * Parse from specific units and return a BigNumber.
   * @param n Number
   * @param decimals Units decimals
   */
  static parse(n: BigNumberish, decimals: number): BigNumber {
    return BigNumber(n).shiftedBy(decimals).decimalPlaces(0);
  }

  /**
   * Format in specific units and return a BigNumber.
   * @param n Number
   * @param decimals Units decimals
   */
  static format(n: BigNumberish, decimals: number): BigNumber {
    return BigNumber(n).shiftedBy(-decimals);
  }
}
