import { Buffer } from 'buffer';
import { borshField } from './core';
import { BorshArray, BorshArrayU8, BorshOption, BorshType, BorshVec, BorshVecU8 } from './mapping';
import { Class } from '../../types';

export type Wrapper<T> = { __inner__: T; unwrap(): T };
export type WrapperClass<T> = new (value: T) => Wrapper<T>;

/**
 * Wrap `string` to serialize in borsh.
 * @example
 * const s = 'Hello World'
 * const buffer = borshStringifier(wrap(s, 'string'))
 * @param data Data to wrap
 * @param type BorshType
 */
export function wrap(data: string, type: 'string'): Wrapper<string>;
/**
 * Wrap `number` to serialize in borsh.
 * @example
 * const n = 1000
 * const buffer = borshStringifier(wrap(n, 'u32'))
 * @param data Data to wrap
 * @param type BorshType
 */
export function wrap(data: number, type: 'u8' | 'u16' | 'u32' | 'f32' | 'f64'): Wrapper<number>;
/**
 * Wrap `bigint` to serialize in borsh.
 * @example
 * const n = 1000000000000000000n
 * const buffer = borshStringifier(wrap(n, 'u128'))
 * @param data Data to wrap
 * @param type BorshType
 */
export function wrap(data: bigint, type: 'u64' | 'u128' | 'u256' | 'u512'): Wrapper<bigint>;
/**
 * Wrap `boolean` to serialize in borsh.
 * @example
 * const flag = true
 * const buffer = borshStringifier(wrap(flag, 'bool'))
 * @param data Data to wrap
 * @param type BorshType
 */
export function wrap(data: boolean, type: 'bool'): Wrapper<boolean>;
/**
 * Wrap `Buffer` to serialize in borsh.
 * @example
 * const data = Buffer.from('Hello World')
 * const buffer = borshStringifier(wrap(data, vec('u8')))
 * @param data Data to wrap
 * @param type BorshType
 */
export function wrap(data: Buffer, type: BorshArrayU8 | BorshVecU8): Wrapper<Buffer>;
/**
 * Wrap `T[]` to serialize in borsh.
 * @example
 * const ms = ['Hello', 'World']
 * const buffer = borshStringifier(wrap<string>(ms, vec('string')))
 * @param data Data to wrap
 * @param type BorshType
 */
export function wrap<T>(data: T[], type: BorshArray | BorshVec): Wrapper<T[]>;
/**
 * Wrap `T | undefined` to serialize in borsh.
 * @example
 *  // Serialize Some
 * const ms = ['Hello', 'World']
 * const buffer = borshStringifier(wrap<string[]>(ms, option(vec('string'))))
 * @example
 * // Serialize None
 * const ms = undefined
 * const buffer = borshStringifier(wrap<string[]>(ms, option(vec('string'))))
 * @param data Data to wrap
 * @param type BorshType
 */
export function wrap<T>(data: T | undefined, type: BorshOption): Wrapper<T | undefined>;
export function wrap<T>(data: T, type: Exclude<BorshType, Class<unknown>>): Wrapper<T>;
export function wrap<T>(data: T, type: Exclude<BorshType, Class<unknown>>): Wrapper<T> {
  const Wrapper = unwrap<T>(type);
  return new Wrapper(data);
}

/**
 * Unwrap `string` to deserialize in borsh.
 * @example
 * const s = borshParser(buffer, unwrap('string'))
 * @param type BorshType
 */
export function unwrap(type: 'string'): WrapperClass<string>;
/**
 * Unwrap `number` to deserialize in borsh.
 * @example
 * const n = borshParser(buffer, unwrap('u32'))
 * @param type BorshType
 */
export function unwrap(type: 'u8' | 'u16' | 'u32' | 'f32' | 'f64'): WrapperClass<number>;
/**
 * Unwrap `bigint` to deserialize in borsh.
 * @example
 * const n = borshParser(buffer, unwrap('u128'))
 * @param type BorshType
 */
export function unwrap(type: 'u64' | 'u128' | 'u256' | 'u512'): WrapperClass<bigint>;
/**
 * Unwrap `boolean` to deserialize in borsh.
 * @example
 * const flag = borshParser(buffer, unwrap('bool'))
 * @param type BorshType
 */
export function unwrap(type: 'bool'): WrapperClass<boolean>;
/**
 * Unwrap `Buffer` to deserialize in borsh.
 * @example
 * const data = borshParser(buffer, unwrap(vec('u8')))
 * @param type BorshType
 */
export function unwrap(type: BorshArrayU8 | BorshVecU8): WrapperClass<Buffer>;
/**
 * Unwrap `T[]` to deserialize in borsh.
 * @example
 * const ms = borshParser(buffer, unwrap<string>(vec('string')))
 * @param type BorshType
 */
export function unwrap<T>(type: BorshArray | BorshVec): WrapperClass<T[]>;
/**
 * Unwrap `T | undefined` to deserialize in borsh.
 * @example
 * const ms = borshParser(buffer, unwrap<string[]>(option(vec('string'))))
 * @param type BorshType
 */
export function unwrap<T>(type: BorshOption): WrapperClass<T | undefined>;
export function unwrap<T>(type: Exclude<BorshType, Class<unknown>>): WrapperClass<T>;
export function unwrap<T>(type: Exclude<BorshType, Class<unknown>>): WrapperClass<T> {
  class Wrapper {
    @borshField({ type, index: 0 })
    __inner__: T;
    constructor(data: T) {
      this.__inner__ = data;
    }
    unwrap(): T {
      return this.__inner__;
    }
  }
  return Wrapper;
}
