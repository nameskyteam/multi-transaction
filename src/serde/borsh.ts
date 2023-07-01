import { Buffer } from 'buffer';
import * as borsh from 'borsh';
import { AssignableClass } from '../utils';

/**
 * Serialize data in borsh format.
 */
export function stringifyBorsh<T>(schema: BorshSchema, data: T): Buffer {
  return Buffer.from(borsh.serialize(schema, data));
}

/**
 * Deserialize data in borsh format.
 */
export function parseBorsh<T>(schema: BorshSchema, data: Uint8Array, dataClass: AssignableClass<T>): T {
  return borsh.deserialize<T>(schema, dataClass, Buffer.from(data));
}

/**
 * Schema that defines the data structure.
 */
export class BorshSchema extends Map<AssignableClass<unknown>, StructSchema | EnumSchema> {
  constructor() {
    super();
  }

  static from(entries: [AssignableClass<unknown>, StructSchema | EnumSchema][]) {
    const iter = entries[Symbol.iterator]();
    const schema = new BorshSchema();
    schema.extend(iter);
    return schema;
  }

  extend(entries: IterableIterator<[AssignableClass<unknown>, StructSchema | EnumSchema]>) {
    for (const [key, value] of entries) {
      this.set(key, value);
    }
  }
}

type StructSchema = { kind: 'struct'; fields: Field[] };
type EnumSchema = { kind: 'enum'; field: 'enum'; values: Field[] };

export type Field = [FieldName, BorshType];
export type FieldName = string;
export type BorshType =
  | AssignableClass<unknown>
  | 'string'
  | 'u8'
  | 'u16'
  | 'u32'
  | 'u64'
  | 'u128'
  | 'u256'
  | 'u512'
  | FixedUint8Array
  | FixedArray
  | DynamicArray
  | DynamicMap
  | Option;

type FixedUint8Array = [ArrayLength];
type FixedArray = [BorshType, ArrayLength];
type DynamicArray = [BorshType];
type DynamicMap = { kind: 'map'; key: BorshType; value: BorshType };
type Option = { kind: 'option'; type: BorshType };

type ArrayLength = number;
