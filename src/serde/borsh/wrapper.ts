import { Buffer } from 'buffer';
import { borsh } from './borsh';
import { BorshArray, BorshArrayU8, BorshOption, BorshType, BorshVec, BorshVecU8 } from './mapping';
import { Class, Wrapper, WrapperClass } from '../../types';

/**
 * Wrap `string` to serialize in borsh format.
 * @example
 * const s = 'Hello World'
 * const buffer = borshStringifier(borshWrap(s, 'string'))
 * @param data Data to wrap
 * @param type BorshType
 */
export function borshWrap(data: string, type: 'string'): Wrapper<string>;
/**
 * Wrap `number` to serialize in borsh format.
 * @example
 * const n = 1000
 * const buffer = borshStringifier(borshWrap(n, 'u32'))
 * @param data Data to wrap
 * @param type BorshType
 */
export function borshWrap(data: number, type: 'u8' | 'u16' | 'u32' | 'f32' | 'f64'): Wrapper<number>;
/**
 * Wrap `bigint` to serialize in borsh format.
 * @example
 * const n = 1000000000000000000n
 * const buffer = borshStringifier(borshWrap(n, 'u128'))
 * @param data Data to wrap
 * @param type BorshType
 */
export function borshWrap(data: bigint, type: 'u64' | 'u128' | 'u256' | 'u512'): Wrapper<bigint>;
/**
 * Wrap `boolean` to serialize in borsh format.
 * @example
 * const flag = true
 * const buffer = borshStringifier(borshWrap(flag, 'bool'))
 * @param data Data to wrap
 * @param type BorshType
 */
export function borshWrap(data: boolean, type: 'bool'): Wrapper<boolean>;
/**
 * Wrap `Buffer` to serialize in borsh format.
 * @example
 * const data = Buffer.from('Hello World')
 * const buffer = borshStringifier(borshWrap(data, vec('u8')))
 * @param data Data to wrap
 * @param type BorshType
 */
export function borshWrap(data: Buffer, type: BorshArrayU8 | BorshVecU8): Wrapper<Buffer>;
/**
 * Wrap `T[]` to serialize in borsh format.
 * @example
 * const ms = ['Hello', 'World']
 * const buffer = borshStringifier(borshWrap<string>(ms, vec('string')))
 * @param data Data to wrap
 * @param type BorshType
 */
export function borshWrap<T>(data: T[], type: BorshArray | BorshVec): Wrapper<T[]>;
/**
 * Wrap `T | undefined` to serialize in borsh format.
 * @example
 *  // Serialize Some
 * const ms = ['Hello', 'World']
 * const buffer = borshStringifier(borshWrap<string[]>(ms, option(vec('string'))))
 * @example
 * // Serialize None
 * const ms = undefined
 * const buffer = borshStringifier(borshWrap<string[]>(ms, option(vec('string'))))
 * @param data Data to wrap
 * @param type BorshType
 */
export function borshWrap<T>(data: T | undefined, type: BorshOption): Wrapper<T | undefined>;
export function borshWrap<T>(data: T, type: Exclude<BorshType, Class<unknown>>): Wrapper<T> {
  const BorshWrapper = borshUnwrap<T>(type);
  return new BorshWrapper(data);
}

/**
 * Unwrap `string` to deserialize in borsh format.
 * @example
 * const s = borshParser(buffer, borshUnwrap('string'))
 * @param type BorshType
 */
export function borshUnwrap(type: 'string'): WrapperClass<string>;
/**
 * Unwrap `number` to deserialize in borsh format.
 * @example
 * const n = borshParser(buffer, borshUnwrap('u32'))
 * @param type BorshType
 */
export function borshUnwrap(type: 'u8' | 'u16' | 'u32' | 'f32' | 'f64'): WrapperClass<number>;
/**
 * Unwrap `bigint` to deserialize in borsh format.
 * @example
 * const n = borshParser(buffer, borshUnwrap('u128'))
 * @param type BorshType
 */
export function borshUnwrap(type: 'u64' | 'u128' | 'u256' | 'u512'): WrapperClass<bigint>;
/**
 * Unwrap `boolean` to deserialize in borsh format.
 * @example
 * const flag = borshParser(buffer, borshUnwrap('bool'))
 * @param type BorshType
 */
export function borshUnwrap(type: 'bool'): WrapperClass<boolean>;
/**
 * Unwrap `Buffer` to deserialize in borsh format.
 * @example
 * const data = borshParser(buffer, borshUnwrap(vec('u8')))
 * @param type BorshType
 */
export function borshUnwrap(type: BorshArrayU8 | BorshVecU8): WrapperClass<Buffer>;
/**
 * Unwrap `T[]` to deserialize in borsh format.
 * @example
 * const ms = borshParser(buffer, borshUnwrap<string>(vec('string')))
 * @param type BorshType
 */
export function borshUnwrap<T>(type: BorshArray | BorshVec): WrapperClass<T[]>;
/**
 * Unwrap `T | undefined` to deserialize in borsh format.
 * @example
 * const ms = borshParser(buffer, borshUnwrap<string[]>(option(vec('string'))))
 * @param type BorshType
 */
export function borshUnwrap<T>(type: BorshOption): WrapperClass<T | undefined>;
export function borshUnwrap<T>(type: Exclude<BorshType, Class<unknown>>): WrapperClass<T>;
export function borshUnwrap<T>(type: Exclude<BorshType, Class<unknown>>): WrapperClass<T> {
  class BorshWrapper implements Wrapper<T> {
    @borsh({ type, index: 0 })
    private value: T;
    constructor(value: T) {
      this.value = value;
    }
    unwrap(): T {
      return this.value;
    }
  }
  return BorshWrapper;
}
