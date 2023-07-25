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
   * const rawAmount = Amount.parse('5', Amount.NEAR_DECIMALS); // BigNumber('5000000000000000000000000')
   * @param amount Human readable amount
   * @param units Units decimals
   */
  static parse(amount: BigNumberish, units: number): BigNumber;
  /**
   * Parse from NEAR units.
   * @example
   * const rawAmount = Amount.parse('5', 'near'); // '5000000000000000000000000'
   * @param amount Human readable amount
   * @param units NEAR units
   */
  static parse(amount: BigNumberish, units: 'near'): string;
  static parse(amount: BigNumberish, units: number | 'near'): BigNumber | string;
  static parse(amount: BigNumberish, units: number | 'near'): BigNumber | string {
    if (units === 'near') {
      return BigNumber(amount).shiftedBy(Amount.NEAR_DECIMALS).toFixed(0);
    } else {
      return BigNumber(amount).shiftedBy(units).decimalPlaces(0);
    }
  }

  /**
   * Format in specific units.
   * @example
   * const USDT_DECIMALS = 6;
   * const humanReadableAmount = Amount.format('5000000000000000000000000', Amount.NEAR_DECIMALS); // BigNumber('5')
   * @param amount Raw amount
   * @param units Units decimals
   * @param decimalPlaces Decimal places
   */
  static format(amount: BigNumberish, units: number, decimalPlaces?: number): BigNumber;
  /**
   * Format in NEAR units.
   * @example
   * const humanReadableAmount = Amount.format('5000000000000000000000000', 'near'); // '5'
   * @param amount Raw amount
   * @param units NEAR units
   * @param decimalPlaces Decimal places
   */
  static format(amount: BigNumberish, units: 'near', decimalPlaces?: number): string;
  static format(amount: BigNumberish, units: number | 'near', decimalPlaces?: number): BigNumber | string;
  static format(amount: BigNumberish, units: number | 'near', decimalPlaces?: number): BigNumber | string {
    if (units === 'near') {
      return BigNumber(amount)
        .shiftedBy(-Amount.NEAR_DECIMALS)
        .toFixed(decimalPlaces as any);
    } else {
      return BigNumber(amount)
        .shiftedBy(-units)
        .decimalPlaces(decimalPlaces as any);
    }
  }
}
