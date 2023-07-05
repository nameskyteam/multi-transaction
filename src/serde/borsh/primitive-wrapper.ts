import { Buffer } from 'buffer';
import { borshField } from './core';
import { BorshArray, BorshArrayU8, BorshOption, BorshType, BorshVec, BorshVecU8 } from './mapping';

export type BorshWrapper<T> = { __value__: T; unwrap(): T };
export type BorshWrapperClass<T> = new (value: T) => BorshWrapper<T>;

/**
 * Wrap a `string` so that we can directly do borsh serialization.
 * @example
 * const s = 'Hello World'
 * const ws = wrapper(s, 'string')
 * const buffer = borshStringifier(ws)
 * @param value Value to wrap
 * @param type BorshType
 */
export function wrapper(value: string, type: 'string'): BorshWrapper<string>;
/**
 * Wrap a `number` so that we can directly do borsh serialization.
 * @example
 * const n = 1000
 * const wn = wrapper(n, 'u32')
 * const buffer = borshStringifier(wn)
 * @param value Value to wrap
 * @param type BorshType
 */
export function wrapper(value: number, type: 'u8' | 'u16' | 'u32' | 'f32' | 'f64'): BorshWrapper<number>;
/**
 * Wrap a `bigint` so that we can directly do borsh serialization.
 * @example
 * const n = 1000000000000000000n
 * const wn = wrapper(n, 'u128')
 * const buffer = borshStringifier(wn)
 * @param value Value to wrap
 * @param type BorshType
 */
export function wrapper(value: bigint, type: 'u64' | 'u128' | 'u256' | 'u512'): BorshWrapper<bigint>;
/**
 * Wrap a `boolean` so that we can directly do borsh serialization.
 * @example
 * const flag = true
 * const wFlag = wrapper(flag, 'bool')
 * const buffer = borshStringifier(wFlag)
 * @param value Value to wrap
 * @param type BorshType
 */
export function wrapper(value: boolean, type: 'bool'): BorshWrapper<boolean>;
/**
 * Wrap a `Buffer` so that we can directly do borsh serialization.
 * @example
 * const data = Buffer.from('Hello World')
 * const wData = wrapper(data, vec('u8'))
 * const buffer = borshStringifier(wData)
 * @param value Value to wrap
 * @param type BorshType
 */
export function wrapper(value: Buffer, type: BorshArrayU8 | BorshVecU8): BorshWrapper<Buffer>;
/**
 * Wrap a `T[]` so that we can directly do borsh serialization.
 * @example
 * const ms = ['Hello', 'World']
 * const wms = wrapper<string>(ms, vec('string'))
 * const buffer = borshStringifier(wms)
 * @param value Value to wrap
 * @param type BorshType
 */
export function wrapper<T>(value: T[], type: BorshArray | BorshVec): BorshWrapper<T[]>;
/**
 * Wrap an optional `T` so that we can directly do borsh serialization.
 * @example
 * const ms = ['Hello', 'World'] // Some
 * const wms = wrapper<string[]>(ms, option(vec('string')))
 * const buffer = borshStringifier(wms)
 * @example
 * const ms = undefined // None
 * const wms = wrapper<string[]>(ms, option(vec('string')))
 * const buffer = borshStringifier(wms)
 * @param value Value to wrap
 * @param type BorshType
 */
export function wrapper<T>(value: T | undefined, type: BorshOption): BorshWrapper<T | undefined>;
export function wrapper<T>(value: T, type: BorshType): BorshWrapper<T>;
export function wrapper<T>(value: T, type: BorshType): BorshWrapper<T> {
  const BorshWrapper = Wrapper<T>(type);
  return new BorshWrapper(value);
}

/**
 * Get a wrapper class so that we can directly do borsh deserialization.
 * @example
 * const BorshWrapper = Wrapper('string')
 * const s = borshParser(buffer, BorshWrapper)
 * @param type BorshType
 */
export function Wrapper(type: 'string'): BorshWrapperClass<string>;
/**
 * Get a wrapper class so that we can directly do borsh deserialization.
 * @example
 * const BorshWrapper = Wrapper('u32')
 * const n = borshParser(buffer, BorshWrapper)
 * @param type BorshType
 */
export function Wrapper(type: 'u8' | 'u16' | 'u32' | 'f32' | 'f64'): BorshWrapperClass<number>;
/**
 * Get a wrapper class so that we can directly do borsh deserialization.
 * @example
 * const BorshWrapper = Wrapper('u128')
 * const n = borshParser(buffer, BorshWrapper)
 * @param type BorshType
 */
export function Wrapper(type: 'u64' | 'u128' | 'u256' | 'u512'): BorshWrapperClass<bigint>;
/**
 * Get a wrapper class so that we can directly do borsh deserialization.
 * @example
 * const BorshWrapper = Wrapper('bool')
 * const flag = borshParser(buffer, BorshWrapper)
 * @param type BorshType
 */
export function Wrapper(type: 'bool'): BorshWrapperClass<boolean>;
/**
 * Get a wrapper class so that we can directly do borsh deserialization.
 * @example
 * const BorshWrapper = Wrapper(vec('u8'))
 * const data = borshParser(buffer, BorshWrapper)
 * @param type BorshType
 */
export function Wrapper(type: BorshArrayU8 | BorshVecU8): BorshWrapperClass<Buffer>;
/**
 * Get a wrapper class so that we can directly do borsh deserialization.
 * @example
 * const BorshWrapper = Wrapper<string>(vec('string'))
 * const ms = borshParser(buffer, BorshWrapper)
 * @param type BorshType
 */
export function Wrapper<T>(type: BorshArray | BorshVec): BorshWrapperClass<T[]>;
/**
 * Get a wrapper class so that we can directly do borsh deserialization.
 * @example
 * const BorshWrapper = Wrapper<string[]>(option(vec('string')))
 * const ms = borshParser(buffer, BorshWrapper)
 * @param type BorshType
 */
export function Wrapper<T>(type: BorshOption): BorshWrapperClass<T | undefined>;
export function Wrapper<T>(type: BorshType): BorshWrapperClass<T>;
export function Wrapper<T>(type: BorshType): BorshWrapperClass<T> {
  class BorshWrapper {
    @borshField({ type })
    __value__: T;
    constructor(value: T) {
      this.__value__ = value;
    }
    unwrap(): T {
      return this.__value__;
    }
  }
  return BorshWrapper;
}
