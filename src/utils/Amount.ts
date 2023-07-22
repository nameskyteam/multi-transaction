import { BigWrapper, BigWrapperSource } from './BigWrapper';

export type AmountSource = BigWrapperSource<Amount>;

export class Amount extends BigWrapper<Amount> {
  static NEAR_DECIMALS = 24 as const;
  static ZERO = '0' as const;
  static ONE_YOCTO = '1' as const;

  private constructor(n: AmountSource) {
    super(n);
  }

  static from(n: AmountSource): Amount {
    return new Amount(n);
  }

  protected override from(n: AmountSource): Amount {
    return Amount.from(n);
  }

  /**
   * parse from specific units
   * @example
   * const USDT_DECIMALS = 6;
   * const rawAmount = Amount.parse('5', USDT_DECIMALS); // Amount('5000000')
   * @param amount human readable amount
   * @param decimals units decimals
   */
  static parse(amount: AmountSource, decimals: number): Amount {
    return Amount.from(amount).shift(decimals).round(0);
  }

  /**
   * format in specific units
   * @example
   * const USDT_DECIMALS = 6;
   * const humanReadableAmount = Amount.format('5000000', USDT_DECIMALS); // Amount('5')
   * @param amount raw amount
   * @param decimals units decimals
   */
  static format(amount: AmountSource, decimals: number): Amount {
    return Amount.from(amount).shift(-decimals);
  }

  /**
   * parse from NEAR units and fix to `string` type
   * @example
   * const yoctoNearAmount = Amount.parseYoctoNear('5'); // '5000000000000000000000000'
   * @param amount NEAR amount
   */
  static parseYoctoNear(amount: AmountSource): string {
    return Amount.parse(amount, Amount.NEAR_DECIMALS).toFixed();
  }

  /**
   * format in NEAR units and fix to `string` type
   * @example
   * const nearAmount = Amount.formatYoctoNear('5000000000000000000000000'); // '5'
   * @param amount yocto NEAR amount
   * @param dp decimal places
   */
  static formatYoctoNear(amount: AmountSource, dp?: number): string {
    return Amount.format(amount, Amount.NEAR_DECIMALS).toFixed(dp);
  }
}
