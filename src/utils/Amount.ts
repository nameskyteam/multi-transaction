import { Numeric } from '../types';
import { Units } from './Units';

const NEAR_DECIMALS = 24;
const USDT_DECIMALS = 6;
const USDC_DECIMALS = 6;
const BTC_DECIMALS = 8;
const ETH_DECIMALS = 18;

export type AmountUnits = 'NEAR' | 'USDT' | 'USDC' | 'BTC' | 'ETH' | number;

export class Amount {
  static readonly ZERO = '0';
  static readonly ONE_YOCTO = '1';

  private constructor() {}

  private static unitsToDecimals(units: AmountUnits): number {
    switch (units) {
      case 'NEAR':
        return NEAR_DECIMALS;
      case 'USDT':
        return USDT_DECIMALS;
      case 'USDC':
        return USDC_DECIMALS;
      case 'BTC':
        return BTC_DECIMALS;
      case 'ETH':
        return ETH_DECIMALS;
      default:
        return units;
    }
  }

  /**
   * Parse from specific units and return a fixed string.
   * @example
   * const rawAmount = Amount.parse('5', 'NEAR'); // '5000000000000000000000000'
   * @param amount human readable amount
   * @param units units
   */
  static parse(amount: Numeric, units: AmountUnits): string {
    return Units.parse(amount, Amount.unitsToDecimals(units)).toFixed(0);
  }

  /**
   * Format in specific units and return a fixed string.
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
