import Big, { BigSource } from 'big.js';

export abstract class BigWrapper<T extends Big> extends Big {
  // --------------------------- override ---------------------------

  /**
   * add
   * @param n
   */
  add(n: BigSource): T {
    return this.from(super.add(n));
  }

  /**
   * sub
   * @param n
   */
  sub(n: BigSource): T {
    return this.from(super.sub(n));
  }

  /**
   * mul
   * @param n
   */
  mul(n: BigSource): T {
    return this.from(super.mul(n));
  }

  /**
   * div
   * @param n
   */
  div(n: BigSource): T {
    return this.from(super.div(n));
  }

  /**
   * plus
   * @param n
   */
  plus(n: BigSource): T {
    return this.from(super.plus(n));
  }

  /**
   * minus
   * @param n
   */
  minus(n: BigSource): T {
    return this.from(super.minus(n));
  }

  /**
   * times
   * @param n
   */
  times(n: BigSource): T {
    return this.from(super.times(n));
  }

  /**
   * pow
   * @param exp exponent
   */
  pow(exp: number): T {
    return this.from(super.pow(exp));
  }

  /**
   * sqrt
   */
  sqrt(): T {
    return this.from(super.sqrt());
  }

  /**
   * mod
   * @param n
   */
  mod(n: BigSource): T {
    return this.from(super.mod(n));
  }

  /**
   * abs
   */
  abs(): T {
    return this.from(super.abs());
  }

  /**
   * neg
   */
  neg(): T {
    return this.from(super.neg());
  }

  /**
   * reserve significant digits
   * @param sd significant digits
   * @param rm rounding mod, default to `Big.roundDown`
   */
  prec(sd: number, rm = Big.roundDown): T {
    return this.from(super.prec(sd, rm));
  }

  /**
   * reserve decimal places
   * @param dp decimal places
   * @param rm rounding mod, default to `Big.roundDown`
   */
  round(dp: number, rm = Big.roundDown): T {
    return this.from(super.round(dp, rm));
  }

  /**
   * convert to fixed string
   * @param dp decimal places, if not provided, reserve as many decimal places as possible
   * @param rm rounding mod, default to `Big.roundDown`
   */
  toFixed(dp?: number, rm = Big.roundDown): string {
    return super.toFixed(dp, rm);
  }

  /**
   * equal to `toFixed()`
   */
  toString(): string {
    return this.toFixed();
  }

  // --------------------------- enhancement ------------------------

  /**
   * decimal shift
   * @param n
   */
  shift(n: number): T {
    return this.mul(this.from(10).pow(n));
  }

  // --------------------------- abstract ---------------------------

  protected abstract from(n: BigSource): T;
}
