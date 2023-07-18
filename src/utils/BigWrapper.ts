import Big from 'big.js';

export type BigWrapperSource<T extends BigWrapper<T>> = BigWrapper<T> | Big | string | number;

/**
 * Abstract class wrap the `Big`
 */
export abstract class BigWrapper<T extends BigWrapper<T>> {
  __inner__: Big;

  protected constructor(n: BigWrapperSource<T>) {
    if (n instanceof BigWrapper) {
      this.__inner__ = n.__inner__;
    } else {
      this.__inner__ = Big(n);
    }
  }

  /**
   * Return `Big`
   */
  unwrap(): Big {
    return this.__inner__;
  }

  /**
   * add
   * @param n
   */
  add(n: BigWrapperSource<T>): T {
    return this.from(this.__inner__.add(n instanceof BigWrapper ? n.__inner__ : n));
  }

  /**
   * sub
   * @param n
   */
  sub(n: BigWrapperSource<T>): T {
    return this.from(this.__inner__.sub(n instanceof BigWrapper ? n.__inner__ : n));
  }

  /**
   * mul
   * @param n
   */
  mul(n: BigWrapperSource<T>): T {
    return this.from(this.__inner__.mul(n instanceof BigWrapper ? n.__inner__ : n));
  }

  /**
   * div
   * @param n
   */
  div(n: BigWrapperSource<T>): T {
    return this.from(this.__inner__.div(n instanceof BigWrapper ? n.__inner__ : n));
  }

  /**
   * plus
   * @param n
   */
  plus(n: BigWrapperSource<T>): T {
    return this.from(this.__inner__.plus(n instanceof BigWrapper ? n.__inner__ : n));
  }

  /**
   * minus
   * @param n
   */
  minus(n: BigWrapperSource<T>): T {
    return this.from(this.__inner__.minus(n instanceof BigWrapper ? n.__inner__ : n));
  }

  /**
   * times
   * @param n
   */
  times(n: BigWrapperSource<T>): T {
    return this.from(this.__inner__.times(n instanceof BigWrapper ? n.__inner__ : n));
  }

  /**
   * pow
   * @param exp exponent
   */
  pow(exp: number): T {
    return this.from(this.__inner__.pow(exp));
  }

  /**
   * sqrt
   */
  sqrt(): T {
    return this.from(this.__inner__.sqrt());
  }

  /**
   * mod
   * @param n
   */
  mod(n: BigWrapperSource<T>): T {
    return this.from(this.__inner__.mod(n instanceof BigWrapper ? n.__inner__ : n));
  }

  /**
   * abs
   */
  abs(): T {
    return this.from(this.__inner__.abs());
  }

  /**
   * neg
   */
  neg(): T {
    return this.from(this.__inner__.neg());
  }

  /**
   * gt
   * @param n
   */
  gt(n: BigWrapperSource<T>): boolean {
    return this.__inner__.gt(n instanceof BigWrapper ? n.__inner__ : n);
  }

  /**
   * gte
   * @param n
   */
  gte(n: BigWrapperSource<T>): boolean {
    return this.__inner__.gte(n instanceof BigWrapper ? n.__inner__ : n);
  }

  /**
   * lt
   * @param n
   */
  lt(n: BigWrapperSource<T>): boolean {
    return this.__inner__.lt(n instanceof BigWrapper ? n.__inner__ : n);
  }

  /**
   * lte
   * @param n
   */
  lte(n: BigWrapperSource<T>): boolean {
    return this.__inner__.lte(n instanceof BigWrapper ? n.__inner__ : n);
  }

  /**
   * eq
   * @param n
   */
  eq(n: BigWrapperSource<T>): boolean {
    return this.__inner__.eq(n instanceof BigWrapper ? n.__inner__ : n);
  }

  /**
   * cmp
   * @param n
   */
  cmp(n: BigWrapperSource<T>): number {
    return this.__inner__.cmp(n instanceof BigWrapper ? n.__inner__ : n);
  }

  /**
   * reserve significant digits
   * @param sd significant digits
   * @param rm rounding mod
   */
  prec(sd: number, rm?: number): T {
    return this.from(this.__inner__.prec(sd, rm));
  }

  /**
   * reserve decimal places
   * @param dp decimal places
   * @param rm rounding mod
   */
  round(dp: number, rm?: number): T {
    return this.from(this.__inner__.round(dp, rm));
  }

  /**
   * convert to `number`, may cause loss of precision
   */
  toNumber(): number {
    return this.__inner__.toNumber();
  }

  /**
   * convert to `string` in fixed point or exponential notation
   * @param sd significant digits
   * @param rm rounding mod
   */
  toPrecision(sd?: number, rm?: number): string {
    return this.__inner__.toPrecision(sd, rm);
  }

  /**
   * convert to `string` in exponential notation
   * @param dp decimal places
   * @param rm rounding mod
   */
  toExponential(dp?: number, rm?: number): string {
    return this.__inner__.toExponential(dp, rm);
  }

  /**
   * convert to `string` in fixed point notation
   * @param dp decimal places
   * @param rm rounding mod
   */
  toFixed(dp?: number, rm?: number): string {
    return this.__inner__.toFixed(dp, rm);
  }

  /**
   * convert to `string` in fixed point or exponential notation
   */
  toString(): string {
    return this.__inner__.toString();
  }

  /**
   * decimal shift
   * @param n
   */
  shift(n: number): T {
    return this.from(10).pow(n).mul(this);
  }

  /**
   * construct a `T` instance
   * @param n
   */
  protected abstract from(n: BigWrapperSource<T>): T;
}
