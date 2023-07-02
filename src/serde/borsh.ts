import { Buffer } from 'buffer';
import * as borsh from 'borsh';
import { AssignableClass, AssignableStruct } from '../utils';

/**
 * Serialize data in borsh format.
 * @param schema Borsh schema
 * @param data Data to serialize
 * @param borshType Description of generics `T`
 */
export function stringifyBorsh<T>(schema: BorshSchema, data: T, borshType?: BorshType): Buffer {
  if (borshType) {
    const { __BorshWrapper__, __schema__ } = getBorshWrapper<T>(borshType);
    __schema__.extend(schema.entries());
    console.log(__schema__);
    return Buffer.from(borsh.serialize(__schema__, new __BorshWrapper__({ __wrap__: data })));
  } else {
    return Buffer.from(borsh.serialize(schema, data));
  }
}

/**
 * Deserialize data in borsh format.
 * @param schema Borsh schema
 * @param data Data to deserialize
 * @param borshType Description of generics `T`
 */
export function parseBorsh<T>(
  schema: BorshSchema,
  data: Uint8Array,
  borshType: AssignableClass<T> | Exclude<BorshType, AssignableClass<unknown>>
): T {
  const { __BorshWrapper__, __schema__ } = getBorshWrapper<T>(borshType);
  __schema__.extend(schema.entries());
  if (typeof borshType === 'function') {
    return borsh.deserialize(__schema__, borshType, Buffer.from(data));
  } else {
    return borsh.deserialize(__schema__, __BorshWrapper__, Buffer.from(data)).__wrap__;
  }
}

/**
 * Get an assignable wrapper `class` and a schema that contains its description.
 * @param borshType Description of generics `T`
 */
function getBorshWrapper<T>(borshType: BorshType) {
  class __BorshWrapper__ extends AssignableStruct {
    declare __wrap__: T;
  }
  const __schema__ = BorshSchema.from([[__BorshWrapper__, { kind: 'struct', fields: [['__wrap__', borshType]] }]]);
  return { __BorshWrapper__, __schema__ };
}

/**
 * Schema that contains `class` description.
 */
export class BorshSchema extends Map<AssignableClass<unknown>, StructSchema | EnumSchema> {
  private constructor() {
    super();
  }

  static new(): BorshSchema {
    return new BorshSchema();
  }

  static from(entries: [AssignableClass<unknown>, StructSchema | EnumSchema][]) {
    const iter = entries[Symbol.iterator]();
    const schema = BorshSchema.new();
    schema.extend(iter);
    return schema;
  }

  extend(entries: IterableIterator<[AssignableClass<unknown>, StructSchema | EnumSchema]>) {
    for (const [key, value] of entries) {
      this.set(key, value);
    }
  }
}

export type StructSchema = { kind: 'struct'; fields: [FieldName, BorshType][] };
export type EnumSchema = { kind: 'enum'; field: 'enum'; values: [FieldName, BorshType][] };
export type FieldName = string;

/**
 * Helper class for create description of borsh serialization types
 */
export class BorshTypes {
  private constructor() {}

  static AssignAbleClass<T>(cls: AssignableClass<T>): AssignableClass<T> {
    return cls;
  }

  static string(): 'string' {
    return 'string';
  }

  static u8(): 'u8' {
    return 'u8';
  }

  static u16(): 'u16' {
    return 'u16';
  }

  static u32(): 'u32' {
    return 'u32';
  }

  static u64(): 'u64' {
    return 'u64';
  }

  static u128(): 'u128' {
    return 'u128';
  }

  static u256(): 'u256' {
    return 'u256';
  }

  static u512(): 'u512' {
    return 'u512';
  }

  static FixedUint8Array(length: number): FixedUint8Array {
    return [length];
  }

  static FixedArray(borshType: BorshType, length: number): FixedArray {
    return [borshType, length];
  }

  static DynamicArray(borshType: BorshType): DynamicArray {
    return [borshType];
  }

  static DynamicMap(keyBorshType: BorshType, valueBorshType: BorshType): DynamicMap {
    return { kind: 'map', key: keyBorshType, value: valueBorshType };
  }

  static Option(borshType: BorshType): Option {
    return { kind: 'option', type: borshType };
  }
}

/**
 * Description of borsh serialization types
 */
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
export type FixedUint8Array = [ArrayLength];
export type FixedArray = [BorshType, ArrayLength];
export type DynamicArray = [BorshType];
export type DynamicMap = { kind: 'map'; key: BorshType; value: BorshType };
export type Option = { kind: 'option'; type: BorshType };
export type ArrayLength = number;
