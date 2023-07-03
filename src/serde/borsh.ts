import { Buffer } from 'buffer';
import { unimplemented } from '../utils';
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
export function parseBorsh<T>(data: Uint8Array, dataType: Class<T>): T {
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
export function wrap<T>(value: T, type: Exclude<BorshType, Class<unknown>>) {
  class BorshWrapper {
    @borsh({ type })
    readonly value: T;

    constructor(value: T) {
      this.value = value;
    }

    unwrap(): T {
      return this.value;
    }
  }

  return new BorshWrapper(value);
}

/**
 * Get a non-custom type wrapper class so that we can directly do borsh deserialization.
 * @example
 * const VecStringWrapper = wrapper<string[]>(vec('string'))
 * const wrappedData = parseBorsh(bytes, VecStringWrapper)
 * const data = wrappedData.unwrap()
 * @param type Non-custom type
 */
export function wrapper<T>(type: Exclude<BorshType, Class<unknown>>) {
  class BorshWrapper {
    @borsh({ type })
    readonly value: T;

    constructor(value: T) {
      this.value = value;
    }

    unwrap(): T {
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

export type BorshType =
  | Class<unknown> // `class`
  | 'string' // `string`
  | 'u8'
  | 'u16'
  | 'u32' // `number`
  | 'u64'
  | 'u128'
  | 'u256'
  | 'u512' // `bigint`
  | 'f32'
  | 'f64' // `number`
  | 'bool' // 'boolean'
  | ArrayType // `Buffer` or `T[]`, fixed size
  | VecType // `Buffer` or `T[]`
  | MapType // TODO unimplemented
  | OptionType; // `T | undefined`

export type Class<T> = BORSH.Constructor<T>;
export type ArrayType = BORSH.FixedArrayKind;
export type VecType = BORSH.VecKind;
export type MapType = never;
export type OptionType = BORSH.OptionKind;

export function array(type: BorshType, length: number): ArrayType {
  return BORSH.fixedArray(type, length);
}

export function vec(type: BorshType): VecType {
  return BORSH.vec(type);
}

export function map(keyType: BorshType, valueType: BorshType): MapType {
  unimplemented();
}

export function option(type: BorshType): OptionType {
  return BORSH.option(type);
}
