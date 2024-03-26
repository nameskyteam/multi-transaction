import { Numeric } from '../types';
import { Units } from './Units';

export class Amount {
  static readonly ZERO = '0';
  static readonly ONE_YOCTO = '1';

  private constructor() {}

  private static unitsToDecimals(units: AmountUnits): number {
    if (units === 'NEAR') {
      return 24;
    }

    if (units === 'USDT') {
      return 6;
    }

    if (units === 'USDC') {
      return 6;
    }

    if (units === 'BTC') {
      return 8;
    }

    if (units === 'ETH') {
      return 18;
    }

    return units;
  }

  /**
   * Parse from specific units and return a fixed string
   * @example
   * const rawAmount = Amount.parse('5', 'NEAR'); // '5000000000000000000000000'
   * @param amount human readable amount
   * @param units units
   */
  static parse(amount: Numeric, units: AmountUnits): string {
    return Units.parse(amount, Amount.unitsToDecimals(units)).toFixed(0);
  }

  /**
   * Format in specific units and return a fixed string
   * @example
   * const humanReadableAmount = Amount.format('5000000000000000000000000', 'NEAR'); // '5'
   * @param amount raw amount
   * @param units units
   * @param decimalPlaces decimal places
   */
  static format(amount: Numeric, units: AmountUnits, decimalPlaces?: number): string {
    amount = Units.format(amount, Amount.unitsToDecimals(units));
    if (decimalPlaces) {
      return amount.toFixed(decimalPlaces);
    } else {
      return amount.toFixed();
    }
  }
}

export type AmountUnits = 'NEAR' | 'USDT' | 'USDC' | 'BTC' | 'ETH' | number;
