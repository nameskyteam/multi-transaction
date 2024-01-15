import { BigNumberLike } from '../types';
import { Units } from './Units';

export type GasUnits = 'T' | 'G' | 'M' | 'K' | number;

export class Gas {
  private constructor() {}

  private static unitsToDecimals(units: GasUnits): number {
    switch (units) {
      case 'T':
        return 12;
      case 'G':
        return 9;
      case 'M':
        return 6;
      case 'K':
        return 3;
      default:
        return units;
    }
  }

  static default(): string {
    return Gas.parse('30', 'T');
  }

  /**
   * Parse from specific units and return a fixed string.
   * @example
   * const rawGas = Gas.parse('30', 'T'); // '30000000000000'
   * @param gas Human readable gas
   * @param units Units decimals
   */
  static parse(gas: BigNumberLike, units: GasUnits): string {
    return Units.parse(gas, Gas.unitsToDecimals(units)).toFixed(0);
  }

  /**
   * Format in specific units and return a fixed string.
   * @example
   * const humanReadableGas = Gas.format('30000000000000', 'T'); // '30'
   * @param gas Raw gas
   * @param units Units decimals
   * @param decimalPlaces Decimal places
   */
  static format(gas: BigNumberLike, units: GasUnits, decimalPlaces?: number): string {
    gas = Units.format(gas, Gas.unitsToDecimals(units));
    if (decimalPlaces) {
      return gas.toFixed(decimalPlaces);
    } else {
      return gas.toFixed();
    }
  }
}
