import { BigNumber } from 'bignumber.js';
import { BigNumberish } from '../types';

export class Amount {
  static NEAR_DECIMALS = 24 as const;
  static ZERO = '0' as const;
  static ONE_YOCTO = '1' as const;

  private constructor() {}

  /**
   * Parse from specific units.
   * @example
   * const rawAmount = Amount.parse('5', 'near'); // '5000000000000000000000000'
   * @param amount Human readable amount
   * @param units Units decimals
   */
  static parse(amount: BigNumberish, units: 'near' | number): string {
    units = units === 'near' ? Amount.NEAR_DECIMALS : units;
    return BigNumber(amount).shiftedBy(units).toFixed(0);
  }

  /**
   * Format in specific units.
   * @example
   * const humanReadableAmount = Amount.format('5000000000000000000000000', 'near'); // '5'
   * @param amount Raw amount
   * @param units Units decimals
   * @param decimalPlaces Decimal places
   */
  static format(amount: BigNumberish, units: 'near' | number, decimalPlaces?: number): string {
    units = units === 'near' ? Amount.NEAR_DECIMALS : units;
    amount = BigNumber(amount).shiftedBy(-units);
    if (decimalPlaces) {
      return amount.toFixed(decimalPlaces);
    } else {
      return amount.toFixed();
    }
  }
}
