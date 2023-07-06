import { Class } from '../../types';
import { Buffer } from 'buffer';
import * as BORSH from '@dao-xyz/borsh';
import { WrapperClass } from './wrapper';
import { BorshArray, BorshArrayU8, BorshOption, BorshType, BorshVec, BorshVecU8 } from './mapping';

/**
 * Serialize data in borsh format.
 * @example
 * // Serialize custom type
 * class Person {
 *  \@borshField({ type: 'string' })
 *   name: string
 *  \@borshField({ type: 'u8' })
 *   age: number
 *   constructor(name: string, age: number) {
 *     this.name = name
 *     this.age = age
 *   }
 * }
 * const alice = new Person('alice', 18)
 * const buffer = borshStringifier(alice)
 * @example
 * // Serialize primitive type
 * const s = 'Hello World'
 * const buffer = borshStringifier(wrap(s, 'string'))
 * @param data Data to serialize
 */
export function borshStringifier<T>(data: T): Buffer {
  return Buffer.from(BORSH.serialize(data));
}

/**
 * Deserialize data in borsh format.
 * @example
 * // Deserialize custom type
 * class Person {
 *  \@borshField({ type: 'string' })
 *   name: string
 *  \@borshField({ type: 'u8' })
 *   age: number
 *   constructor(name: string, age: number) {
 *     this.name = name
 *     this.age = age
 *   }
 * }
 * const person = borshParser(buffer, Person)
 * @param buffer Data to deserialize
 * @param type Class of generics `T`
 */
export function borshParser<T>(buffer: Uint8Array, type: Class<T>): T;
/**
 * Deserialize data in borsh format.
 * @example
 * // Deserialize primitive type
 * const s = borshParser(buffer, unwrap('string'))
 * @param buffer Data to deserialize
 * @param type `Wrapper` class which wraps the generics `T`
 */
export function borshParser<T>(buffer: Uint8Array, type: WrapperClass<T>): T;
export function borshParser<T>(buffer: Uint8Array, type: Class<T> | WrapperClass<T>): T;
export function borshParser<T>(buffer: Uint8Array, type: Class<T> | WrapperClass<T>): T {
  const res = BORSH.deserialize(buffer, type);
  const fields: BORSH.Field[] = type.prototype[PROTOTYPE_SCHEMA_OFFSET].fields;
  if (fields.length === 1 && fields[0].key === '__inner__' && 'unwrap' in res) {
    return res.unwrap();
  } else {
    return res;
  }
}

/**
 * Defined in borsh-ts
 */
const PROTOTYPE_SCHEMA_OFFSET = 1500;

/**
 * Class decorator for borsh. Used for distinguishing between classes that extend from the same class.
 * @param index Class index
 */
export function variant(index: string | number | number[]): ClassDecorator {
  return BORSH.variant(index);
}

/**
 * Property decorator for borsh.
 */
export function borshField({ type, index }: BorshFieldOptions): PropertyDecorator {
  return BORSH.field({ type: transformBorshType(type), index });
}

export interface BorshFieldOptions {
  type: BorshType;
  index?: number;
}

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
