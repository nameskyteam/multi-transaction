import Big from 'big.js';

export type BigWrapperSource<T extends BigWrapper<T>> = T | Big | string | number;

export abstract class BigWrapper<T extends BigWrapper<T>> {
  protected value: Big;

  protected constructor(n: BigWrapperSource<T>) {
    this.value = this.sourceToBig(n);
  }

  private sourceToBig(n: BigWrapperSource<T>): Big {
    return n instanceof BigWrapper ? n.value : Big(n);
  }

  toBig(): Big {
    return this.value;
  }

  add(n: BigWrapperSource<T>): T {
    return this.from(this.value.add(this.sourceToBig(n)));
  }

  sub(n: BigWrapperSource<T>): T {
    return this.from(this.value.sub(this.sourceToBig(n)));
  }

  mul(n: BigWrapperSource<T>): T {
    return this.from(this.value.mul(this.sourceToBig(n)));
  }

  div(n: BigWrapperSource<T>): T {
    return this.from(this.value.div(this.sourceToBig(n)));
  }

  plus(n: BigWrapperSource<T>): T {
    return this.from(this.value.plus(this.sourceToBig(n)));
  }

  minus(n: BigWrapperSource<T>): T {
    return this.from(this.value.minus(this.sourceToBig(n)));
  }

  times(n: BigWrapperSource<T>): T {
    return this.from(this.value.times(this.sourceToBig(n)));
  }

  pow(exp: number): T {
    return this.from(this.value.pow(exp));
  }

  shift(n: number): T {
    return this.mul(this.from(10).pow(n));
  }

  sqrt(): T {
    return this.from(this.value.sqrt());
  }

  mod(n: BigWrapperSource<T>): T {
    return this.from(this.value.mod(this.sourceToBig(n)));
  }

  abs(): T {
    return this.from(this.value.abs());
  }

  neg(): T {
    return this.from(this.value.neg());
  }

  gt(n: BigWrapperSource<T>): boolean {
    return this.value.gt(this.sourceToBig(n));
  }

  gte(n: BigWrapperSource<T>): boolean {
    return this.value.gte(this.sourceToBig(n));
  }

  lt(n: BigWrapperSource<T>): boolean {
    return this.value.lt(this.sourceToBig(n));
  }

  lte(n: BigWrapperSource<T>): boolean {
    return this.value.lte(this.sourceToBig(n));
  }

  eq(n: BigWrapperSource<T>): boolean {
    return this.value.eq(this.sourceToBig(n));
  }

  cmp(n: BigWrapperSource<T>): number {
    return this.value.cmp(this.sourceToBig(n));
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

  protected abstract from(n: BigWrapperSource<T>): T;
}
