import { Buffer } from 'buffer';
import * as borsh from 'borsh';
import { AssignableClass, AssignableStruct } from '../utils';

/**
 * Serialize data in borsh format.
 * @param schema Borsh schema
 * @param data Data to serialize
 * @param dataType Data type description. if data type is an assignable class, this param can be ignored
 */
export function stringifyBorsh<T>(schema: BorshSchema, data: T, dataType?: BorshType): Buffer {
  if (dataType) {
    const { __BorshWrapper__, __schema__ } = getBorshWrapper<T>(dataType);
    __schema__.extend(schema.entries());
    return Buffer.from(borsh.serialize(__schema__, new __BorshWrapper__({ __wrapped__: data })));
  } else {
    return Buffer.from(borsh.serialize(schema, data));
  }
}

/**
 * Deserialize data in borsh format.
 * @param schema Borsh schema
 * @param data Data to deserialize
 * @param dataType Data type description
 */
export function parseBorsh<T>(
  schema: BorshSchema,
  data: Uint8Array,
  dataType: AssignableClass<T> | Exclude<BorshType, AssignableClass<unknown>>
): T {
  const { __BorshWrapper__, __schema__ } = getBorshWrapper<T>(dataType);
  __schema__.extend(schema.entries());
  if (typeof dataType === 'function') {
    return borsh.deserialize(__schema__, dataType, Buffer.from(data));
  } else {
    return borsh.deserialize(__schema__, __BorshWrapper__, Buffer.from(data)).__wrap__;
  }
}

/**
 * Get an assignable wrapper `class` and a schema that contains its description.
 * @param dataTypeDescription Description of generics `T`
 */
function getBorshWrapper<T>(dataTypeDescription: BorshType) {
  class __BorshWrapper__ extends AssignableStruct {
    declare __wrap__: T;
  }
  const __schema__ = BorshSchema.from([
    [__BorshWrapper__, { kind: 'struct', fields: [['__wrap__', dataTypeDescription]] }],
  ]);
  return { __BorshWrapper__, __schema__ };
}

/**
 * Schema that contains the `class` description.
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

type StructSchema = { kind: 'struct'; fields: [FieldName, BorshType][] };
type EnumSchema = { kind: 'enum'; field: 'enum'; values: [FieldName, BorshType][] };

export type FieldName = string;

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

type FixedUint8Array = [ArrayLength];
type FixedArray = [BorshType, ArrayLength];
type DynamicArray = [BorshType];
type DynamicMap = { kind: 'map'; key: BorshType; value: BorshType };
type Option = { kind: 'option'; type: BorshType };

type ArrayLength = number;
