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
   * const rawAmount = Amount.parse('5', 'near'); // BigNumber('5000000000000000000000000')
   * @param amount Human readable amount
   * @param units Units decimals
   */
  static parse(amount: BigNumberish, units: 'near' | number): BigNumber {
    units = units === 'near' ? Amount.NEAR_DECIMALS : units;
    return BigNumber(amount).shiftedBy(units).decimalPlaces(0);
  }

  /**
   * Parse from specific units.
   * @example
   * const rawAmount = Amount.parse('5', 'near'); // '5000000000000000000000000'
   * @param amount Human readable amount
   * @param units Units decimals
   */
  static parseStr(amount: BigNumberish, units: 'near' | number): string {
    return Amount.parse(amount, units).toFixed();
  }

  /**
   * Format in specific units.
   * @example
   * const humanReadableAmount = Amount.format('5000000000000000000000000', 'near'); // BigNumber('5')
   * @param amount Raw amount
   * @param units Units decimals
   */
  static format(amount: BigNumberish, units: 'near' | number): BigNumber {
    units = units === 'near' ? Amount.NEAR_DECIMALS : units;
    return BigNumber(amount).shiftedBy(-units);
  }

  /**
   * Format in specific units.
   * @example
   * const humanReadableAmount = Amount.format('5000000000000000000000000', 'near'); // '5'
   * @param amount Raw amount
   * @param units Units decimals
   * @param decimalPlaces Decimal places
   */
  static formatStr(amount: BigNumberish, units: 'near' | number, decimalPlaces?: number): string {
    amount = Amount.format(amount, units);
    if (decimalPlaces) {
      return amount.toFixed(decimalPlaces);
    } else {
      return amount.toFixed();
    }
  }
}
