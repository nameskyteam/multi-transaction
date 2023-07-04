import { Buffer } from 'buffer';
import * as BORSH from '@dao-xyz/borsh';

/**
 * Serialize data in borsh format.
 * @param data Data to serialize
 */
export function borshStringifier<T>(data: T): Buffer {
  return Buffer.from(BORSH.serialize(data));
}

/**
 * Deserialize data in borsh format.
 * @param data Data to deserialize
 * @param type Class of generics `T`
 */
export function borshParser<T>(data: Uint8Array, type: Constructor<T>): T {
  return BORSH.deserialize(data, type);
}

/**
 * Wrap a non-custom type value so that we can directly do borsh serialization.
 * @example
 * const data = ['Hello', 'World']
 * const wrappedData = wrap(data, vec('string'))
 * const bytes = stringifyBorsh(wrappedData)
 * @param value Value to wrap
 * @param type Non-custom type
 */
export function wrap<T extends CommonBorshType>(value: FromCommonBorshType<T>, type: T) {
  class BorshWrapper {
    @borsh({ type })
    readonly value: FromCommonBorshType<T>;

    constructor(value: FromCommonBorshType<T>) {
      this.value = value;
    }

    unwrap(): FromCommonBorshType<T> {
      return this.value;
    }
  }

  return new BorshWrapper(value);
}

/**
 * Get a non-custom type wrapper class so that we can directly do borsh deserialization.
 * @example
 * const VecStringWrapper = wrapper(vec('string'))
 * const wrappedData = parseBorsh(bytes, VecStringWrapper)
 * const data: string[] = wrappedData.unwrap()
 * @param type Non-custom type
 */
export function wrapper<T extends CommonBorshType>(type: T) {
  class BorshWrapper {
    @borsh({ type })
    readonly value: FromCommonBorshType<T>;

    constructor(value: FromCommonBorshType<T>) {
      this.value = value;
    }

    unwrap(): FromCommonBorshType<T> {
      return this.value;
    }
  }

  return BorshWrapper;
}

/**
 * Class decorator for borsh serialization. Used for distinguishing classes that extend from the same class.
 * @param index Class index
 */
export function variant(index: string | number | number[]): ClassDecorator {
  return BORSH.variant(index);
}

/**
 * Property decorator for borsh serialization.
 * @param options Borsh options
 */
export function borsh(options: BorshOptions): PropertyDecorator {
  return BORSH.field({ type: transformBorshType(options.type), index: options.index });
}

export interface BorshOptions {
  type: BorshType;
  index?: number;
}

/**
 * Array
 * @param type
 * @param length
 */
export function array(type: BorshType, length: number): BorshArray;
export function array(type: 'u8', length: number): BorshArrayU8;
export function array(type: BorshType, length: number): BorshArray | BorshArrayU8 {
  if (type === 'u8') {
    return new BorshArrayU8(length);
  } else {
    return new BorshArray(type, length);
  }
}

/**
 * Vec
 * @param type
 */
export function vec(type: BorshType): BorshVec;
export function vec(type: 'u8'): BorshVecU8;
export function vec(type: BorshType): BorshVec | BorshVecU8 {
  if (type === 'u8') {
    return new BorshVecU8();
  } else {
    return new BorshVec(type);
  }
}

/**
 * Option
 * @param type
 */
export function option(type: BorshType): BorshOption {
  return new BorshOption(type);
}

/**
 * Type Mapping
 * * `Constructor<T>` -> `class`
 * * `string` -> `string`
 * * `u8`, `u16`, `u32` -> `number`
 * * `u64`, `u128`, `u256`, `u512` -> `bigint`
 * * `f32`, `f64` -> `number`
 * * `bool` -> `boolean`
 * * `BorshArrayU8` -> `Buffer`
 * * `BorshArray` -> `any[]`
 * * `BorshVecU8` -> `Buffer`
 * * `BorshVec` -> `any[]`
 * * `BorshOption` -> `any`
 */
export type BorshType = Constructor<unknown> | CommonBorshType;

export type CommonBorshType =
  | 'string'
  | 'u8'
  | 'u16'
  | 'u32'
  | 'u64'
  | 'u128'
  | 'u256'
  | 'u512'
  | 'f32'
  | 'f64'
  | 'bool'
  | BorshArray
  | BorshArrayU8
  | BorshVec
  | BorshVecU8
  | BorshOption;

export type Constructor<T> = new (...args: any[]) => T;

export class BorshArray {
  __array__: PhantomData;
  value: BorshType;
  length: number;

  constructor(value: BorshType, length: number) {
    this.value = value;
    this.length = length;
  }
}

export class BorshArrayU8 {
  __array_u8__: PhantomData;
  value = 'u8' as const;
  length: number;

  constructor(length: number) {
    this.length = length;
  }
}

export class BorshVec {
  __vec__: PhantomData;
  value: BorshType;

  constructor(value: BorshType) {
    this.value = value;
  }
}

export class BorshVecU8 {
  __vec_u8__: PhantomData;
  value = 'u8' as const;
}

export class BorshOption {
  __option__: PhantomData;
  value: BorshType;

  constructor(value: BorshType) {
    this.value = value;
  }
}

export type MapBorshType<T, A, Z> = T extends A ? Z : never;

export type FromCommonBorshType<T> =
  | FromString<T>
  | FromU8<T>
  | FromU16<T>
  | FromU32<T>
  | FromU64<T>
  | FromU128<T>
  | FromU256<T>
  | FromU512<T>
  | FromBool<T>
  | FromArray<T>
  | FromArrayU8<T>
  | FromVec<T>
  | FromVecU8<T>
  | FromOption<T>;

export type FromString<T> = MapBorshType<T, 'string', string>;
export type FromU8<T> = MapBorshType<T, 'u8', number>;
export type FromU16<T> = MapBorshType<T, 'u16', number>;
export type FromU32<T> = MapBorshType<T, 'u32', number>;
export type FromU64<T> = MapBorshType<T, 'u64', bigint>;
export type FromU128<T> = MapBorshType<T, 'u128', bigint>;
export type FromU256<T> = MapBorshType<T, 'u256', bigint>;
export type FromU512<T> = MapBorshType<T, 'u512', bigint>;
export type FromBool<T> = MapBorshType<T, 'bool', boolean>;
export type FromArray<T> = MapBorshType<T, BorshArray, any[]>;
export type FromArrayU8<T> = MapBorshType<T, BorshArrayU8, Buffer>;
export type FromVec<T> = MapBorshType<T, BorshVec, any[]>;
export type FromVecU8<T> = MapBorshType<T, BorshVecU8, Buffer>;
export type FromOption<T> = MapBorshType<T, BorshOption, any>;

/**
 * Allow a type to have a required field that is actually `undefined`.
 * This is very useful when distinguishing between types with similar fields, as different types can have
 * different type marks, and these type marks usually do not affect the code logic.
 * @example
 * class Person {
 *   __person__: PhantomData; // a type mark, required field
 *   name: string; // required field
 *   age?: number; // optional field
 *
 *   constructor(name: string, age?: number) {
 *     this.name = name;
 *     this.age = age;
 *   }
 * }
 * const alice: Person = { name: 'alice' } // error TS2741: Property '__person__' is missing
 */
export type PhantomData = undefined;

function transformBorshType(type: BorshType): BORSH.FieldType {
  if (type instanceof BorshArray) {
    return BORSH.fixedArray(transformBorshType(type.value), type.length);
  } else if (type instanceof BorshArrayU8) {
    return BORSH.fixedArray(type.value, type.length);
  } else if (type instanceof BorshVec) {
    return BORSH.vec(transformBorshType(type.value));
  } else if (type instanceof BorshVecU8) {
    return BORSH.vec(type.value);
  } else if (type instanceof BorshOption) {
    return BORSH.option(transformBorshType(type.value));
  } else {
    return type;
  }
}
