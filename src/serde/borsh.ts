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
export class BorshSchema extends Map<SchemaKey, SchemaValue> {
  private constructor() {
    super();
  }

  static new() {
    return new BorshSchema();
  }

  static from(entries: SchemaEntry[]) {
    const iter = entries[Symbol.iterator]();
    const schema = BorshSchema.new();
    schema.extend(iter);
    return schema;
  }

  extend(entries: IterableIterator<SchemaEntry>) {
    for (const [key, value] of entries) {
      this.set(key, value);
    }
  }
}

export type SchemaEntry = [SchemaKey, SchemaValue];
export type SchemaKey = AssignableClass<unknown>;
export type SchemaValue = StructValue | EnumValue;
type StructValue = { kind: 'struct'; fields: Field[] };
type EnumValue = { kind: 'enum'; field: 'enum'; values: Field[] };

export type Field = [FieldName, FieldType];
export type FieldName = string;
export type FieldType =
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
type FixedArray = [FieldType, ArrayLength];
type DynamicArray = [FieldType];
type DynamicMap = { kind: 'map'; key: FieldType; value: FieldType };
type Option = { kind: 'option'; type: FieldType };

type ArrayLength = number;
