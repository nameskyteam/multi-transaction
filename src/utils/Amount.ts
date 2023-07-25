import { BigNumber } from 'bignumber.js';
import { BigNumberish } from '../types';
import { Units } from './Units';

export type AmountUnits = 'near' | number;

export class Amount {
  static ZERO = '0' as const;
  static ONE_YOCTO = '1' as const;

  private constructor() {}

  private static unitsToDecimals(units: AmountUnits): number {
    if (units === 'near') {
      return 24;
    } else {
      return units;
    }
  }

  /**
   * Parse from specific units and return a fixed string.
   * @example
   * const rawAmount = Amount.parse('5', 'near'); // '5000000000000000000000000'
   * @param amount Human readable amount
   * @param units Units decimals
   */
  static parse(amount: BigNumberish, units: AmountUnits): string {
    return Units.parse(amount, Amount.unitsToDecimals(units));
  }

  /**
   * Parse from specific units and return a BigNumber.
   * @example
   * const rawAmount = Amount.parseBigNumber('5', 'near'); // BigNumber('5000000000000000000000000')
   * @param amount Human readable amount
   * @param units Units decimals
   */
  static parseBigNumber(amount: BigNumberish, units: AmountUnits): BigNumber {
    return Units.parseBigNumber(amount, Amount.unitsToDecimals(units));
  }

  /**
   * Format in specific units and return a fixed string.
   * @example
   * const humanReadableAmount = Amount.format('5000000000000000000000000', 'near'); // '5'
   * @param amount Raw amount
   * @param units Units decimals
   * @param decimalPlaces Decimal places
   */
  static format(amount: BigNumberish, units: AmountUnits, decimalPlaces?: number): string {
    return Units.format(amount, Amount.unitsToDecimals(units), decimalPlaces);
  }

  /**
   * Format in specific units and return a BigNumber.
   * @example
   * const humanReadableAmount = Amount.formatBigNumber('5000000000000000000000000', 'near'); // BigNumber('5')
   * @param amount Raw amount
   * @param units Units decimals
   */
  static formatBigNumber(amount: BigNumberish, units: AmountUnits): BigNumber {
    return Units.formatBigNumber(amount, Amount.unitsToDecimals(units));
  }
}
