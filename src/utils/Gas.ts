import { Numeric } from '../types';
import { Units } from './Units';

export type GasUnits = 'T' | 'G' | 'M' | 'K' | number;

export class Gas {
  static readonly DEFAULT = '3000000000000';

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

  /**
   * Parse from specific units and return a fixed string
   * @example
   * const rawGas = Gas.parse('5', 'T'); // '5000000000000'
   * @param gas human readable gas
   * @param units units
   */
  static parse(gas: Numeric, units: GasUnits): string {
    return Units.parse(gas, Gas.unitsToDecimals(units)).toFixed(0);
  }

  /**
   * Format in specific units and return a fixed string
   * @example
   * const humanReadableGas = Gas.format('5000000000000', 'T'); // '5'
   * @param gas raw gas
   * @param units units
   * @param decimalPlaces decimal places
   */
  static format(gas: Numeric, units: GasUnits, decimalPlaces?: number): string {
    gas = Units.format(gas, Gas.unitsToDecimals(units));
    if (decimalPlaces) {
      return gas.toFixed(decimalPlaces);
    } else {
      return gas.toFixed();
    }
  }
}
