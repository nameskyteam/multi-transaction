import { Class } from '../../types';
import { Buffer } from 'buffer';
import * as BORSH from '@dao-xyz/borsh';
import { BorshWrapperClass } from './primitive-wrapper';
import { BorshArray, BorshArrayU8, BorshOption, BorshType, BorshVec, BorshVecU8 } from './mapping';

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
export function borshParser<T>(data: Uint8Array, type: Class<T>): T;
/**
 * Deserialize data in borsh format.
 * @param data Data to deserialize
 * @param type `BorshWrapper` which wraps the generics `T`
 */
export function borshParser<T>(data: Uint8Array, type: BorshWrapperClass<T>): T;
/**
 * Deserialize data in borsh format.
 * @param data Data to deserialize
 * @param type Class of generics `T` or `BorshWrapper` class which wraps the generics `T`
 */
export function borshParser<T>(data: Uint8Array, type: Class<T> | BorshWrapperClass<T>): T;
export function borshParser<T>(data: Uint8Array, type: Class<T> | BorshWrapperClass<T>): T {
  const res = BORSH.deserialize(data, type);
  const fields: BORSH.Field[] = type.prototype[1500].fields;
  if (fields.length === 1 && fields[0].key === '__value__' && '__value__' in res && 'unwrap' in res) {
    return res.unwrap();
  } else {
    return res;
  }
}

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
