import { BigNumberish } from '../types';
import { Units } from './Units';

export const NEAR_DECIMALS = 24 as const;

export type AmountUnits = 'near' | number;

export class Amount {
  private constructor() {}

  private static unitsToDecimals(units: AmountUnits): number {
    if (units === 'near') {
      return NEAR_DECIMALS;
    } else {
      return units;
    }
  }

  /**
   * No deposit yocto NEAR
   */
  static noDeposit(): '0' {
    return '0';
  }

  /**
   * One yocto NEAR
   */
  static oneYocto(): '1' {
    return '1';
  }

  /**
   * Parse from specific units and return a fixed string.
   * @example
   * const rawAmount = Amount.parse('5', 'near'); // '5000000000000000000000000'
   * @param amount Human readable amount
   * @param units Units decimals
   */
  static parse(amount: BigNumberish, units: AmountUnits): string {
    return Units.parse(amount, Amount.unitsToDecimals(units)).toFixed();
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
    amount = Units.format(amount, Amount.unitsToDecimals(units));
    if (decimalPlaces) {
      return amount.toFixed(decimalPlaces);
    } else {
      return amount.toFixed();
    }
  }
}
