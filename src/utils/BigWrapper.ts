import Big from 'big.js';

export type BigWrapperSource<T extends BigWrapper<T>> = BigWrapper<T> | Big | string | number;

/**
 * Abstract class wrap the `Big`
 */
export abstract class BigWrapper<T extends BigWrapper<T>> {
  inner: Big;

  protected constructor(n: BigWrapperSource<T>) {
    if (n instanceof BigWrapper) {
      this.inner = n.inner;
    } else {
      this.inner = Big(n);
    }
  }
  // --------------------------- override ---------------------------

  /**
   * add
   * @param n
   */
  add(n: BigWrapperSource<T>): T {
    return this.from(this.inner.add(n instanceof BigWrapper ? n.inner : n));
  }

  /**
   * sub
   * @param n
   */
  sub(n: BigWrapperSource<T>): T {
    return this.from(this.inner.sub(n instanceof BigWrapper ? n.inner : n));
  }

  /**
   * mul
   * @param n
   */
  mul(n: BigWrapperSource<T>): T {
    return this.from(this.inner.mul(n instanceof BigWrapper ? n.inner : n));
  }

  /**
   * div
   * @param n
   */
  div(n: BigWrapperSource<T>): T {
    return this.from(this.inner.div(n instanceof BigWrapper ? n.inner : n));
  }

  /**
   * plus
   * @param n
   */
  plus(n: BigWrapperSource<T>): T {
    return this.from(this.inner.plus(n instanceof BigWrapper ? n.inner : n));
  }

  /**
   * minus
   * @param n
   */
  minus(n: BigWrapperSource<T>): T {
    return this.from(this.inner.minus(n instanceof BigWrapper ? n.inner : n));
  }

  /**
   * times
   * @param n
   */
  times(n: BigWrapperSource<T>): T {
    return this.from(this.inner.times(n instanceof BigWrapper ? n.inner : n));
  }

  /**
   * pow
   * @param exp exponent
   */
  pow(exp: number): T {
    return this.from(this.inner.pow(exp));
  }

  /**
   * sqrt
   */
  sqrt(): T {
    return this.from(this.inner.sqrt());
  }

  /**
   * mod
   * @param n
   */
  mod(n: BigWrapperSource<T>): T {
    return this.from(this.inner.mod(n instanceof BigWrapper ? n.inner : n));
  }

  /**
   * abs
   */
  abs(): T {
    return this.from(this.inner.abs());
  }

  /**
   * neg
   */
  neg(): T {
    return this.from(this.inner.neg());
  }

  /**
   * gt
   * @param n
   */
  gt(n: BigWrapperSource<T>): boolean {
    return this.inner.gt(n instanceof BigWrapper ? n.inner : n);
  }

  /**
   * gte
   * @param n
   */
  gte(n: BigWrapperSource<T>): boolean {
    return this.inner.gte(n instanceof BigWrapper ? n.inner : n);
  }

  /**
   * lt
   * @param n
   */
  lt(n: BigWrapperSource<T>): boolean {
    return this.inner.lt(n instanceof BigWrapper ? n.inner : n);
  }

  /**
   * lte
   * @param n
   */
  lte(n: BigWrapperSource<T>): boolean {
    return this.inner.lte(n instanceof BigWrapper ? n.inner : n);
  }

  /**
   * eq
   * @param n
   */
  eq(n: BigWrapperSource<T>): boolean {
    return this.inner.eq(n instanceof BigWrapper ? n.inner : n);
  }

  /**
   * cmp
   * @param n
   */
  cmp(n: BigWrapperSource<T>): number {
    return this.inner.cmp(n instanceof BigWrapper ? n.inner : n);
  }

  /**
   * reserve significant digits
   * @param sd significant digits
   * @param rm rounding mod
   */
  prec(sd: number, rm?: number): T {
    return this.from(this.inner.prec(sd, rm));
  }

  /**
   * reserve decimal places
   * @param dp decimal places
   * @param rm rounding mod
   */
  round(dp: number, rm?: number): T {
    return this.from(this.inner.round(dp, rm));
  }

  /**
   * convert to `number`, may cause loss of precision
   */
  toNumber(): number {
    return this.inner.toNumber();
  }

  /**
   * convert to `string` in fixed point or exponential notation
   * @param sd significant digits
   * @param rm rounding mod
   */
  toPrecision(sd?: number, rm?: number): string {
    return this.inner.toPrecision(sd, rm);
  }

  /**
   * convert to `string` in exponential notation
   * @param dp decimal places
   * @param rm rounding mod
   */
  toExponential(dp?: number, rm?: number): string {
    return this.inner.toExponential(dp, rm);
  }

  /**
   * convert to `string` in fixed point notation
   * @param dp decimal places
   * @param rm rounding mod
   */
  toFixed(dp?: number, rm?: number): string {
    return this.inner.toFixed(dp, rm);
  }

  /**
   * convert to `string` in fixed point or exponential notation
   */
  toString(): string {
    return this.inner.toString();
  }

  // --------------------------- enhancement ------------------------

  /**
   * decimal shift
   * @param n
   */
  shift(n: number): T {
    return this.from(10).pow(n).mul(this);
  }

  // --------------------------- abstract ---------------------------

  /**
   * construct a `T` instance
   * @param n
   */
  protected abstract from(n: BigWrapperSource<T>): T;
}
