import { BigNumber } from 'bignumber.js';
import { BigNumberish } from '../types';

export class Gas {
  static TERA_DECIMALS = 12 as const;
  static GIGA_DECIMALS = 9 as const;

  // 30 Tera gas
  static DEFAULT = '30000000000000' as const;

  private constructor() {}

  /**
   * Parse from specific units and return a fixed string.
   * @example
   * const rawGas = Gas.parse('30', 'tera'); // '30000000000000'
   * @param gas Human readable gas
   * @param units Units decimals
   */
  static parse(gas: BigNumberish, units: 'tera' | 'giga' | number): string {
    return Gas.parseBigNumber(gas, units).toFixed();
  }

  /**
   * Parse from specific units and return a BigNumber.
   * @example
   * const rawGas = Gas.parseBigNumber('30', 'tera'); // BigNumber('30000000000000')
   * @param gas Human readable gas
   * @param units Units decimals
   */
  static parseBigNumber(gas: BigNumberish, units: 'tera' | 'giga' | number): BigNumber {
    if (units === 'tera') {
      units = Gas.TERA_DECIMALS;
    } else if (units === 'giga') {
      units = Gas.GIGA_DECIMALS;
    }
    return BigNumber(gas).shiftedBy(units).decimalPlaces(0);
  }

  /**
   * Format in specific units and return a fixed string.
   * @example
   * const humanReadableGas = Gas.format('30000000000000', 'tera'); // '30'
   * @param gas Raw gas
   * @param units Units decimals
   * @param decimalPlaces Decimal places
   */
  static format(gas: BigNumberish, units: 'tera' | 'giga' | number, decimalPlaces?: number): string {
    gas = Gas.formatBigNumber(gas, units);
    if (decimalPlaces) {
      return gas.toFixed(decimalPlaces);
    } else {
      return gas.toFixed();
    }
  }

  /**
   * Format in specific units and return a BigNumber.
   * @example
   * const humanReadableGas = Gas.formatBigNumber('30000000000000', 'tera'); // BigNumber('30')
   * @param gas Raw gas
   * @param units Units decimals
   */
  static formatBigNumber(gas: BigNumberish, units: 'tera' | 'giga' | number): BigNumber {
    if (units === 'tera') {
      units = Gas.TERA_DECIMALS;
    } else if (units === 'giga') {
      units = Gas.GIGA_DECIMALS;
    }
    return BigNumber(gas).shiftedBy(-units);
  }
}
