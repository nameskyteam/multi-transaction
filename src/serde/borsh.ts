import { Buffer } from 'buffer';
import * as BORSH from '@dao-xyz/borsh';

/**
 * Serialize data in borsh format.
 * @param data Data to serialize
 */
export function stringifyBorsh<T>(data: T): Buffer {
  return Buffer.from(BORSH.serialize(data));
}

/**
 * Deserialize data in borsh format.
 * @param data Data to deserialize
 * @param dataType Class of generics `T`
 */
export function parseBorsh<T>(data: Uint8Array, dataType: Constructor<T>): T {
  return BORSH.deserialize(data, dataType);
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
export function wrap<T extends Exclude<BorshType, Constructor<unknown>>>(value: BorshMapping<T>, type: T) {
  class BorshWrapper {
    @borsh({ type })
    readonly value: BorshMapping<T>;

    constructor(value: BorshMapping<T>) {
      this.value = value;
    }

    unwrap(): BorshMapping<T> {
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
export function wrapper<T extends Exclude<BorshType, Constructor<unknown>>>(type: T) {
  class BorshWrapper {
    @borsh({ type })
    readonly value: BorshMapping<T>;

    constructor(value: BorshMapping<T>) {
      this.value = value;
    }

    unwrap(): BorshMapping<T> {
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
  return BORSH.field(options);
}

export interface BorshOptions {
  type: BorshType;
  index?: number;
}

/**
 * Fixed size Array
 * @param type
 * @param length
 */
export function array(type: 'u8', length: number): BorshArrayU8;
export function array(type: BorshType, length: number): BorshArray;
export function array(type: BorshType, length: number): BorshArrayU8 | BorshArray {
  return BorshArray.from(BORSH.fixedArray(type, length));
}

/**
 * Vec
 * @param type
 */
export function vec(type: 'u8'): BorshVecU8;
export function vec(type: BorshType): BorshVec;
export function vec(type: BorshType): BorshVecU8 | BorshVec {
  return BorshVec.from(BORSH.vec(type));
}

/**
 * Option
 * @param type
 */
export function option(type: BorshType): BorshOption {
  return BorshOption.from(BORSH.option(type));
}

/**
 * Type Mapping
 * * `Constructor<T>` -> `class`
 * * `string` -> `string`
 * * `u8`, `u16`, `u32` -> `number`
 * * `u64`, `u128`, `u256`, `u512` -> `bigint`
 * * `f32`, `f64` -> `number`
 * * `bool` -> `boolean`
 * * `BorshArray` -> `Buffer` or `T[]`, fixed size
 * * `BorshVec` -> `Buffer` or `T[]`
 * * `BorshOption` -> `T | undefined`
 */
export type BorshType =
  | Constructor<unknown>
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
  | BorshArrayU8
  | BorshArray
  | BorshVecU8
  | BorshVec
  | BorshOption;

export type Constructor<T> = BORSH.Constructor<T>;

export class BorshArray extends BORSH.FixedArrayKind {
  __array__: PhantomData;

  constructor(props: BORSH.FixedArrayKind) {
    super(props.elementType, props.length);
  }

  static from(props: BORSH.FixedArrayKind): BorshArray {
    return new BorshArray(props);
  }
}

export class BorshArrayU8 extends BORSH.FixedArrayKind {
  __array_u8__: PhantomData;
  elementType: 'u8';

  private constructor(props: BORSH.FixedArrayKind) {
    super(props.elementType, props.length);
    this.elementType = 'u8';
  }

  static from(props: BORSH.FixedArrayKind): BorshArray {
    return new BorshArray(props);
  }
}

export class BorshVec extends BORSH.VecKind {
  __vec__: PhantomData;

  constructor(props: BORSH.VecKind) {
    super(props.elementType, props.sizeEncoding);
  }

  static from(props: BORSH.VecKind): BorshVec {
    return new BorshVec(props);
  }
}

export class BorshVecU8 extends BORSH.VecKind {
  __vec_u8__: PhantomData;
  elementType: 'u8';

  constructor(props: BORSH.VecKind) {
    super(props.elementType, props.sizeEncoding);
    this.elementType = 'u8';
  }
}

export class BorshOption extends BORSH.OptionKind {
  __option__: PhantomData = undefined;

  constructor(props: BORSH.OptionKind) {
    super(props.elementType);
  }

  static from(props: BORSH.OptionKind): BorshOption {
    return new BorshOption(props);
  }
}

export type BorshMapping<T extends BorshType> =
  | MappingNumber<T>
  | MappingString<T>
  | MappingBigInt<T>
  | MappingBoolean<T>
  | MappingBuffer<T>
  | MappingArray<T>
  | MappingUndefined<T>;
export type MappingString<T extends BorshType> = T extends 'string' ? string : never;
export type MappingNumber<T extends BorshType> = T extends 'u8' | 'u16' | 'u32' | 'f32' | 'f64' ? number : never;
export type MappingBigInt<T extends BorshType> = T extends 'u64' | 'u128' | 'u256' | 'u512' ? bigint : never;
export type MappingBoolean<T extends BorshType> = T extends 'bool' ? boolean : never;
export type MappingBuffer<T extends BorshType> = T extends BorshArrayU8 | BorshVecU8 ? Buffer : never;
export type MappingArray<T extends BorshType> = T extends BorshArray | BorshVec ? Array<any> : never;
export type MappingUndefined<T extends BorshType> = T extends BorshOption ? any | undefined : never;

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
