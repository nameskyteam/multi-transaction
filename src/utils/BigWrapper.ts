import Big, { BigSource, Comparison, RoundingMode } from 'big.js';

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
   * gt
   * @param n
   */
  gt(n: BigSource): boolean {
    return super.gt(n);
  }

  /**
   * gte
   * @param n
   */
  gte(n: BigSource): boolean {
    return super.gte(n);
  }

  /**
   * lt
   * @param n
   */
  lt(n: BigSource): boolean {
    return super.lt(n);
  }

  /**
   * lte
   * @param n
   */
  lte(n: BigSource): boolean {
    return super.lte(n);
  }

  /**
   * eq
   * @param n
   */
  eq(n: BigSource): boolean {
    return super.eq(n);
  }

  /**
   * cmp
   * @param n
   */
  cmp(n: BigSource): Comparison {
    return super.cmp(n);
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
   * convert to fixed `string`
   * @param dp decimal places, if not provided, reserve as many decimal places as possible
   * @param rm rounding mod, default to `Big.roundDown`
   */
  toFixed(dp?: number, rm = Big.roundDown): string {
    return super.toFixed(dp, rm);
  }

  /**
   * convert to `string` with reserved significant digits
   * @param sd significant digits, if not provided, reserve as many significant digits as possible
   * @param rm rounding mod, default to `Big.roundDown`
   */
  toPrecision(sd?: number, rm = Big.roundDown): string {
    return super.toPrecision(sd, rm);
  }

  /**
   * convert to `string` in exponential notation with reserved decimal places
   * @param dp decimal places, if not provided, reserve as many decimal places as possible
   * @param rm rounding mod, default to `Big.roundDown`
   */
  toExponential(dp?: number, rm = Big.roundDown): string {
    return super.toExponential(dp, rm);
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

  /**
   * construct a `T` instance
   * @param n
   * @protected
   */
  protected abstract from(n: BigSource): T;
}
