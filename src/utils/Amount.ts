import Big, { BigSource } from 'big.js';

export type AmountSource = Amount | BigSource;

export class Amount {
  inner: Big;

  static NEAR_DECIMALS = 24;
  static ZERO = '0';
  static ONE_YOCTO = '1';

  private constructor(n: AmountSource) {
    this.inner = new Big(n instanceof Amount ? n.inner : n);
  }

  static new(n: AmountSource): Amount {
    return new Amount(n);
  }

  mul(n: AmountSource): Amount {
    return Amount.new(this.inner.mul(n instanceof Amount ? n.inner : n));
  }

  div(n: AmountSource): Amount {
    return Amount.new(this.inner.div(n instanceof Amount ? n.inner : n));
  }

  add(n: AmountSource): Amount {
    return Amount.new(this.inner.add(n instanceof Amount ? n.inner : n));
  }

  sub(n: AmountSource): Amount {
    return Amount.new(this.inner.sub(n instanceof Amount ? n.inner : n));
  }

  shift(n: number): Amount {
    return Amount.new(this).mulPow(10, n);
  }

  pow(exp: number): Amount {
    return Amount.new(this.inner.pow(exp));
  }

  mulPow(base: AmountSource, exp: number): Amount {
    return this.mul(Amount.new(base).pow(exp));
  }

  divPow(base: AmountSource, exp: number): Amount {
    return this.mulPow(base, -exp);
  }

  gt(n: AmountSource): boolean {
    return this.inner.gt(Amount.new(n).inner);
  }

  gte(n: AmountSource): boolean {
    return this.inner.gte(Amount.new(n).inner);
  }

  lt(n: AmountSource): boolean {
    return this.inner.lt(Amount.new(n).inner);
  }

  lte(n: AmountSource): boolean {
    return this.inner.lte(Amount.new(n).inner);
  }

  eq(n: AmountSource): boolean {
    return this.inner.eq(Amount.new(n).inner);
  }

  static max(...values: AmountSource[]): Amount {
    return values
      .map((n) => Amount.new(n))
      .sort((n1, n2) => {
        if (n1.gte(n2)) {
          return -1;
        }
        return 1;
      })[0];
  }

  static min(...values: AmountSource[]): Amount {
    return values
      .map((n) => Amount.new(n))
      .sort((n1, n2) => {
        if (n1.lte(n2)) {
          return -1;
        }
        return 1;
      })[0];
  }

  /**
   * Round
   * @param dp decimal places
   */
  round(dp: number): Amount {
    return new Amount(this.inner.round(dp, Big.roundDown));
  }

  /**
   * Fix to `string` type, round down for decimal places
   * @example
   * const USDT_DECIMALS = 6;
   * const amount = Amount.parse(5, USDT_DECIMALS); //Amount(5000000)
   * const amountFixed = amount.toFixed(); // '5000000'
   * @param dp Decimal places
   */
  toFixed(dp?: number): string {
    return this.inner.toFixed(dp, Big.roundDown);
  }

  /**
   * Parse from specify units
   * @example
   * const USDT_DECIMALS = 6;
   * const amount = Amount.parse(5, USDT_DECIMALS); //Amount(5000000)
   * @param humanReadAmount human read amount
   * @param decimals
   */
  static parse(humanReadAmount: AmountSource, decimals: number): Amount {
    return Amount.new(humanReadAmount).shift(decimals).round(0);
  }

  /**
   * Format in specify units
   * @example
   * const USDT_DECIMALS = 6;
   * const amount = Amount.parse(5, USDT_DECIMALS); //Amount(5000000)
   * const humanReadAmount = Amount.format(amount, USDT_DECIMALS); // Amount(5)
   * @param amount amount
   * @param decimals Units decimals
   */
  static format(amount: AmountSource, decimals: number): Amount {
    return Amount.new(amount).shift(-decimals);
  }

  /**
   * Parse from NEAR units and fix to `string` type
   * @example
   * const yoctoAmount = Amount.parseYoctoNear(5); // '5000000000000000000000000'
   * @param nearAmount amount in NEAR units
   */
  static parseYoctoNear(nearAmount: AmountSource): string {
    return Amount.parse(nearAmount, Amount.NEAR_DECIMALS).toFixed();
  }

  /**
   * Format in NEAR units and fix to `string` type
   * @example
   * const yoctoAmount = Amount.parseYoctoNear(5); // '5000000000000000000000000'
   * const nearAmount = Amount.formatYoctoNear(yoctoAmount); // '5'
   * @param yoctoAmount Amount in yocto units
   * @param dp Decimal places
   */
  static formatYoctoNear(yoctoAmount: AmountSource, dp?: number): string {
    return Amount.format(yoctoAmount, Amount.NEAR_DECIMALS).toFixed(dp);
  }
}
