/**
 * Refers to a class that implements `T`
 */
import { BigNumber } from 'bignumber.js';

export type Class<T> = new (...args: any[]) => T;

/**
 * Refers to a class that implements `Wrapper<T>`
 */
export type WrapperClass<T> = Class<Wrapper<T>>;

/**
 * Wrapper
 */
export interface Wrapper<T> {
  unwrap(): T;
}

export type BigNumberish = BigNumber | string | number;
