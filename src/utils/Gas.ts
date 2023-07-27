import { BigNumberish } from '../types';
import { Units } from './Units';

export type GasUnits = 'tera' | 'giga' | 'mega' | 'kilo' | number;

export class Gas {
  private constructor() {}

  private static unitsToDecimals(units: GasUnits): number {
    switch (units) {
      case 'tera':
        return 12;
      case 'giga':
        return 9;
      case 'mega':
        return 6;
      case 'kilo':
        return 3;
      default:
        return units;
    }
  }

  static default(): string {
    return Gas.parse('30', 'tera');
  }

  /**
   * Parse from specific units and return a fixed string.
   * If you prefer a `BigNumber` as return, use `Units.parse` instead.
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
   * If you prefer a `BigNumber` as return, use `Units.format` instead.
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
