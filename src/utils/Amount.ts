import { BigWrapper, BigWrapperSource } from './BigWrapper';

export class Amount extends BigWrapper<Amount> {
  static NEAR_DECIMALS = 24;
  static ZERO = '0';
  static ONE_YOCTO = '1';

  private constructor(n: BigWrapperSource<Amount>) {
    super(n);
  }

  /**
   * construct an `Amount` instance
   * @param n
   */
  static from(n: BigWrapperSource<Amount>): Amount {
    return new Amount(n);
  }

  protected from(n: BigWrapperSource<Amount>): Amount {
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
  static parse(amount: BigWrapperSource<Amount>, decimals: number): Amount {
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
  static format(amount: BigWrapperSource<Amount>, decimals: number): Amount {
    return Amount.from(amount).shift(-decimals);
  }

  /**
   * parse from NEAR units and fix to `string` type
   * @example
   * const yoctoNearAmount = Amount.parseYoctoNear('5'); // '5000000000000000000000000'
   * @param amount NEAR amount
   */
  static parseYoctoNear(amount: BigWrapperSource<Amount>): string {
    return Amount.parse(amount, Amount.NEAR_DECIMALS).toFixed();
  }

  /**
   * format in NEAR units and fix to `string` type
   * @example
   * const nearAmount = Amount.formatYoctoNear('5000000000000000000000000'); // '5'
   * @param amount yocto NEAR amount
   * @param dp decimal places
   */
  static formatYoctoNear(amount: BigWrapperSource<Amount>, dp?: number): string {
    return Amount.format(amount, Amount.NEAR_DECIMALS).toFixed(dp);
  }
}
