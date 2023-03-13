import Big, { BigSource } from 'big.js';

export type GasSource = Gas | BigSource;

export class Gas {
  inner: Big;

  /**
   * 30 tera gas
   */
  static DEFAULT = Gas.tera(30);

  private constructor(n: GasSource) {
    this.inner = new Big(n instanceof Gas ? n.inner : n);
  }

  static new(n: GasSource): Gas {
    return new Gas(n);
  }

  mul(n: GasSource): Gas {
    return Gas.new(this.inner.mul(n instanceof Gas ? n.inner : n));
  }

  div(n: GasSource): Gas {
    return Gas.new(this.inner.div(n instanceof Gas ? n.inner : n));
  }

  add(n: GasSource): Gas {
    return Gas.new(this.inner.add(n instanceof Gas ? n.inner : n));
  }

  sub(n: GasSource): Gas {
    return Gas.new(this.inner.sub(n instanceof Gas ? n.inner : n));
  }

  pow(exp: number): Gas {
    return Gas.new(this.inner.pow(exp));
  }

  mulPow(base: GasSource, exp: number): Gas {
    return this.mul(Gas.new(base).pow(exp));
  }

  divPow(base: GasSource, exp: number): Gas {
    return this.div(Gas.new(base).pow(exp));
  }

  gt(n: GasSource): boolean {
    return this.inner.gt(Gas.new(n).inner);
  }

  gte(n: GasSource): boolean {
    return this.inner.gte(Gas.new(n).inner);
  }

  lt(n: GasSource): boolean {
    return this.inner.lt(Gas.new(n).inner);
  }

  lte(n: GasSource): boolean {
    return this.inner.lte(Gas.new(n).inner);
  }

  eq(n: GasSource): boolean {
    return this.inner.eq(Gas.new(n).inner);
  }

  /**
   * Fix to `string` type
   * @example
   * const gas = Gas.parse(5); // Gas(5000000000000)
   * const gasFixed = gas.toFixed(); // '5000000000000'
   */
  toFixed(): string {
    return this.inner.toFixed(0, Big.roundDown);
  }

  /**
   * Parse from tera units
   * @example
   * const gas = Gas.parse(5); // Gas(5000000000000)
   * @param teraGas Gas in tera units
   */
  static parse(teraGas: GasSource): Gas {
    return Gas.new(teraGas).mulPow(10, 12);
  }

  /**
   * Format in tera units
   * @example
   * const gas = Gas.parse(5); // Gas(5000000000000)
   * const teraGas = Gas.format(gas); // Gas(5)
   * @param gas Gas without units
   */
  static format(gas: GasSource): Gas {
    return Gas.new(gas).divPow(10, 12);
  }

  /**
   * Parse from tera units and fix to `string` type
   * @example
   * const gasFixed = Gas.tera(5); // '5000000000000'
   * @param teraGas Gas in tera units
   */
  static tera(teraGas: GasSource): string {
    return Gas.parse(teraGas).toFixed();
  }
}
