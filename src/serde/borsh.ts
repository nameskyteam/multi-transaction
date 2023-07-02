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
    const { BorshWrapper, schema: schemaWithBorshWrapper } = getBorshWrapper<T>(borshType);
    schemaWithBorshWrapper.extend(schema.entries());
    return Buffer.from(borsh.serialize(schemaWithBorshWrapper, new BorshWrapper({ inner: data })));
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
  const { BorshWrapper, schema: schemaWithBorshWrapper } = getBorshWrapper<T>(borshType);
  schemaWithBorshWrapper.extend(schema.entries());
  if (typeof borshType === 'function') {
    return borsh.deserialize(schemaWithBorshWrapper, borshType, Buffer.from(data));
  } else {
    return borsh.deserialize(schemaWithBorshWrapper, BorshWrapper, Buffer.from(data)).inner;
  }
}

/**
 * Get an assignable wrapper `class` and a schema that contains its description.
 * @param borshType Description of generics `T`
 */
function getBorshWrapper<T>(borshType: BorshType) {
  class BorshWrapper extends AssignableStruct {
    declare inner: T;
  }
  const schema = BorshSchema.from([[BorshWrapper, { kind: 'struct', fields: [['inner', borshType]] }]]);
  return { BorshWrapper, schema };
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

export type StructSchema = { kind: 'struct'; fields: [string, BorshType][] };
export type EnumSchema = { kind: 'enum'; field: 'enum'; values: [string, BorshType][] };

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

  static u8array(length: number): u8array {
    return [length];
  }

  static array(borshType: BorshType, length: number): array {
    return [borshType, length];
  }

  static vec(borshType: BorshType): vec {
    return [borshType];
  }

  static map(keyBorshType: BorshType, valueBorshType: BorshType): map {
    return { kind: 'map', key: keyBorshType, value: valueBorshType };
  }

  static option(borshType: BorshType): option {
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
  | u8array
  | array
  | vec
  | map
  | option;
export type u8array = [number];
export type array = [BorshType, number];
export type vec = [BorshType];
export type map = { kind: 'map'; key: BorshType; value: BorshType };
export type option = { kind: 'option'; type: BorshType };
