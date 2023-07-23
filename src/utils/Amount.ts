import { BigNumber } from 'bignumber.js';
import { BigNumberish } from '../types';

export class Amount {
  static NEAR_DECIMALS = 24 as const;
  static ZERO = '0' as const;
  static ONE_YOCTO = '1' as const;

  private constructor() {}

  /**
   * parse from specific units
   * @example
   * const USDT_DECIMALS = 6;
   * const rawAmount = Amount.parse('5', USDT_DECIMALS); // BigNumber('5000000')
   * @param amount human readable amount
   * @param decimals units decimals
   */
  static parse(amount: BigNumberish, decimals: number): BigNumber {
    return BigNumber(amount).shiftedBy(decimals).decimalPlaces(0);
  }

  /**
   * format in specific units
   * @example
   * const USDT_DECIMALS = 6;
   * const humanReadableAmount = Amount.format('5000000', USDT_DECIMALS); // BigNumber('5')
   * @param amount raw amount
   * @param decimals units decimals
   */
  static format(amount: BigNumberish, decimals: number): BigNumber {
    return BigNumber(amount).shiftedBy(-decimals);
  }

  /**
   * parse from NEAR units and fix to `string` type
   * @example
   * const yoctoNearAmount = Amount.parseYoctoNear('5'); // '5000000000000000000000000'
   * @param amount NEAR amount
   */
  static parseYoctoNear(amount: BigNumberish): string {
    return Amount.parse(amount, Amount.NEAR_DECIMALS).toFixed();
  }

  /**
   * format in NEAR units and fix to `string` type
   * @example
   * const nearAmount = Amount.formatYoctoNear('5000000000000000000000000'); // '5'
   * @param amount yocto NEAR amount
   * @param decimalPlaces decimal places
   */
  static formatYoctoNear(amount: BigNumberish, decimalPlaces?: number): string {
    return Amount.format(amount, Amount.NEAR_DECIMALS).toFixed(decimalPlaces as any);
  }
}
