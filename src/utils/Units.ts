import { BigNumber } from 'bignumber.js';
import { BigNumberLike } from '../types';

export class Units {
  private constructor() {}

  /**
   * Parse from specific units and return a BigNumber.
   * @param n n
   * @param decimals decimals
   */
  static parse(n: BigNumberLike, decimals: number): BigNumber {
    return BigNumber(n).shiftedBy(decimals);
  }

  /**
   * Format in specific units and return a BigNumber.
   * @param n n
   * @param decimals decimals
   */
  static format(n: BigNumberLike, decimals: number): BigNumber {
    return BigNumber(n).shiftedBy(-decimals);
  }
}
