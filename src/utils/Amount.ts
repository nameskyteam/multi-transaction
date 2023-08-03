import { BigNumberLike } from '../types';
import { Units } from './Units';

export const NEAR_DECIMALS = 24 as const;
export const USDT_DECIMALS = 6 as const;
export const USDC_DECIMALS = 6 as const;
export const DAI_DECIMALS = 18 as const;
export const BTC_DECIMALS = 8 as const;
export const ETH_DECIMALS = 18 as const;

export type AmountUnits = 'near' | 'usdt' | 'usdc' | 'dai' | 'btc' | 'eth' | number;

export class Amount {
  private constructor() {}

  private static unitsToDecimals(units: AmountUnits): number {
    switch (units) {
      case 'near':
        return NEAR_DECIMALS;
      case 'usdt':
        return USDT_DECIMALS;
      case 'usdc':
        return USDC_DECIMALS;
      case 'dai':
        return DAI_DECIMALS;
      case 'btc':
        return BTC_DECIMALS;
      case 'eth':
        return ETH_DECIMALS;
      default:
        return units;
    }
  }

  static default(): string {
    return '0';
  }

  static oneYocto(): string {
    return '1';
  }

  /**
   * Parse from specific units and return a fixed string.
   * If you prefer a `BigNumber` as return, use `Units.parse` instead.
   * @example
   * const rawAmount = Amount.parse('5', 'near'); // '5000000000000000000000000'
   * @param amount Human readable amount
   * @param units Units decimals
   */
  static parse(amount: BigNumberLike, units: AmountUnits): string {
    return Units.parse(amount, Amount.unitsToDecimals(units)).toFixed(0);
  }

  /**
   * Format in specific units and return a fixed string.
   * If you prefer a `BigNumber` as return, use `Units.format` instead.
   * @example
   * const humanReadableAmount = Amount.format('5000000000000000000000000', 'near'); // '5'
   * @param amount Raw amount
   * @param units Units decimals
   * @param decimalPlaces Decimal places
   */
  static format(amount: BigNumberLike, units: AmountUnits, decimalPlaces?: number): string {
    amount = Units.format(amount, Amount.unitsToDecimals(units));
    if (decimalPlaces) {
      return amount.toFixed(decimalPlaces);
    } else {
      return amount.toFixed();
    }
  }
}
