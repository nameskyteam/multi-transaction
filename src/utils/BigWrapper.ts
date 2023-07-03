import Big from 'big.js';

export type BigWrapperSource<T extends BigWrapper<T>> = BigWrapper<T> | Big | string | number;

/**
 * Abstract class wrap the `Big`
 */
export abstract class BigWrapper<T extends BigWrapper<T>> {
  value: Big;

  protected constructor(n: BigWrapperSource<T>) {
    if (n instanceof BigWrapper) {
      this.value = n.value;
    } else {
      this.value = Big(n);
    }
  }

  unwrap(): Big {
    return this.value;
  }

  // --------------------------- override ---------------------------

  /**
   * add
   * @param n
   */
  add(n: BigWrapperSource<T>): T {
    return this.from(this.value.add(n instanceof BigWrapper ? n.value : n));
  }

  /**
   * sub
   * @param n
   */
  sub(n: BigWrapperSource<T>): T {
    return this.from(this.value.sub(n instanceof BigWrapper ? n.value : n));
  }

  /**
   * mul
   * @param n
   */
  mul(n: BigWrapperSource<T>): T {
    return this.from(this.value.mul(n instanceof BigWrapper ? n.value : n));
  }

  /**
   * div
   * @param n
   */
  div(n: BigWrapperSource<T>): T {
    return this.from(this.value.div(n instanceof BigWrapper ? n.value : n));
  }

  /**
   * plus
   * @param n
   */
  plus(n: BigWrapperSource<T>): T {
    return this.from(this.value.plus(n instanceof BigWrapper ? n.value : n));
  }

  /**
   * minus
   * @param n
   */
  minus(n: BigWrapperSource<T>): T {
    return this.from(this.value.minus(n instanceof BigWrapper ? n.value : n));
  }

  /**
   * times
   * @param n
   */
  times(n: BigWrapperSource<T>): T {
    return this.from(this.value.times(n instanceof BigWrapper ? n.value : n));
  }

  /**
   * pow
   * @param exp exponent
   */
  pow(exp: number): T {
    return this.from(this.value.pow(exp));
  }

  /**
   * sqrt
   */
  sqrt(): T {
    return this.from(this.value.sqrt());
  }

  /**
   * mod
   * @param n
   */
  mod(n: BigWrapperSource<T>): T {
    return this.from(this.value.mod(n instanceof BigWrapper ? n.value : n));
  }

  /**
   * abs
   */
  abs(): T {
    return this.from(this.value.abs());
  }

  /**
   * neg
   */
  neg(): T {
    return this.from(this.value.neg());
  }

  /**
   * gt
   * @param n
   */
  gt(n: BigWrapperSource<T>): boolean {
    return this.value.gt(n instanceof BigWrapper ? n.value : n);
  }

  /**
   * gte
   * @param n
   */
  gte(n: BigWrapperSource<T>): boolean {
    return this.value.gte(n instanceof BigWrapper ? n.value : n);
  }

  /**
   * lt
   * @param n
   */
  lt(n: BigWrapperSource<T>): boolean {
    return this.value.lt(n instanceof BigWrapper ? n.value : n);
  }

  /**
   * lte
   * @param n
   */
  lte(n: BigWrapperSource<T>): boolean {
    return this.value.lte(n instanceof BigWrapper ? n.value : n);
  }

  /**
   * eq
   * @param n
   */
  eq(n: BigWrapperSource<T>): boolean {
    return this.value.eq(n instanceof BigWrapper ? n.value : n);
  }

  /**
   * cmp
   * @param n
   */
  cmp(n: BigWrapperSource<T>): number {
    return this.value.cmp(n instanceof BigWrapper ? n.value : n);
  }

  /**
   * reserve significant digits
   * @param sd significant digits
   * @param rm rounding mod
   */
  prec(sd: number, rm?: number): T {
    return this.from(this.value.prec(sd, rm));
  }

  /**
   * reserve decimal places
   * @param dp decimal places
   * @param rm rounding mod
   */
  round(dp: number, rm?: number): T {
    return this.from(this.value.round(dp, rm));
  }

  /**
   * convert to `number`, may cause loss of precision
   */
  toNumber(): number {
    return this.value.toNumber();
  }

  /**
   * convert to `string` in fixed point or exponential notation
   * @param sd significant digits
   * @param rm rounding mod
   */
  toPrecision(sd?: number, rm?: number): string {
    return this.value.toPrecision(sd, rm);
  }

  /**
   * convert to `string` in exponential notation
   * @param dp decimal places
   * @param rm rounding mod
   */
  toExponential(dp?: number, rm?: number): string {
    return this.value.toExponential(dp, rm);
  }

  /**
   * convert to `string` in fixed point notation
   * @param dp decimal places
   * @param rm rounding mod
   */
  toFixed(dp?: number, rm?: number): string {
    return this.value.toFixed(dp, rm);
  }

  /**
   * convert to `string` in fixed point or exponential notation
   */
  toString(): string {
    return this.value.toString();
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
