import { BigNumberish } from '../types';
import { Units } from './Units';

export type GasUnits = 'tera' | number;

export class Gas {
  private constructor() {}

  private static unitsToDecimals(units: GasUnits): number {
    if (units === 'tera') {
      return 12;
    } else {
      return units;
    }
  }

  /**
   * Default gas 30 Tera
   */
  static default(): '30000000000000' {
    return '30000000000000';
  }

  /**
   * Parse from specific units and return a fixed string.
   * @example
   * const rawGas = Gas.parse('30', 'tera'); // '30000000000000'
   * @param gas Human readable gas
   * @param units Units decimals
   */
  static parse(gas: BigNumberish, units: GasUnits): string {
    return Units.parse(gas, Gas.unitsToDecimals(units)).toFixed();
  }

  /**
   * Format in specific units and return a fixed string.
   * @example
   * const humanReadableGas = Gas.format('30000000000000', 'tera'); // '30'
   * @param gas Raw gas
   * @param units Units decimals
   * @param decimalPlaces Decimal places
   */
  static format(gas: BigNumberish, units: GasUnits, decimalPlaces?: number): string {
    gas = Units.format(gas, Gas.unitsToDecimals(units));
    if (decimalPlaces) {
      return gas.toFixed(decimalPlaces);
    } else {
      return gas.toFixed();
    }
  }
}
