import { BigNumber } from 'bignumber.js';
import { BigNumberish } from '../types';
import { Units } from './Units';

export type GasUnits = 'tera' | 'giga' | number;

export class Gas {
  static DEFAULT = '30000000000000' as const; // 30 Tera gas

  private constructor() {}

  private static unitsToDecimals(units: GasUnits): number {
    if (units === 'tera') {
      return 12;
    } else if (units === 'giga') {
      return 9;
    } else {
      return units;
    }
  }

  /**
   * Parse from specific units and return a fixed string.
   * @example
   * const rawGas = Gas.parse('30', 'tera'); // '30000000000000'
   * @param gas Human readable gas
   * @param units Units decimals
   */
  static parse(gas: BigNumberish, units: GasUnits): string {
    return Units.parse(gas, Gas.unitsToDecimals(units));
  }

  /**
   * Parse from specific units and return a BigNumber.
   * @example
   * const rawGas = Gas.parseBigNumber('30', 'tera'); // BigNumber('30000000000000')
   * @param gas Human readable gas
   * @param units Units decimals
   */
  static parseBigNumber(gas: BigNumberish, units: GasUnits): BigNumber {
    return Units.parseBigNumber(gas, Gas.unitsToDecimals(units));
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
    return Units.format(gas, Gas.unitsToDecimals(units), decimalPlaces);
  }

  /**
   * Format in specific units and return a BigNumber.
   * @example
   * const humanReadableGas = Gas.formatBigNumber('30000000000000', 'tera'); // BigNumber('30')
   * @param gas Raw gas
   * @param units Units decimals
   */
  static formatBigNumber(gas: BigNumberish, units: GasUnits): BigNumber {
    return Units.formatBigNumber(gas, Gas.unitsToDecimals(units));
  }
}
