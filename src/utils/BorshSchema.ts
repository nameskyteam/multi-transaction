import * as borsh from 'borsh';
import { mapRecord } from './common';

export class BorshSchema {
  private readonly schema: borsh.Schema;

  private constructor(schema: borsh.Schema) {
    this.schema = schema;
  }

  static from(schema: borsh.Schema) {
    return new BorshSchema(schema);
  }

  into(): borsh.Schema {
    return this.schema;
  }

  // --------------------------------------- struct ---------------------------------------
  static Struct(fields: Record<string, BorshSchema>): BorshSchema {
    return BorshSchema.from({
      struct: mapRecord(fields, (_, schema) => schema.into()),
    });
  }

  static Array(value: BorshSchema, len: number): BorshSchema {
    return BorshSchema.from({ array: { type: value.into(), len } });
  }

  static Vec(value: BorshSchema): BorshSchema {
    return BorshSchema.from({ array: { type: value.into() } });
  }

  static HashMap(key: BorshSchema, value: BorshSchema): BorshSchema {
    return BorshSchema.from({ map: { key: key.into(), value: value.into() } });
  }

  static HashSet(value: BorshSchema): BorshSchema {
    return BorshSchema.from({ set: value.into() });
  }

  // -------------------------------------- enum ------------------------------------------
  static Enum(values: Record<string, BorshSchema>[]): BorshSchema {
    const schemas = values.map((value) => {
      return { struct: mapRecord(value, (_, schema) => schema.into()) };
    });

    return BorshSchema.from({ enum: schemas });
  }

  static Option(value: BorshSchema): BorshSchema {
    return BorshSchema.from({ option: value.into() });
  }

  // -------------------------------------- primitive -------------------------------------
  static get u8(): BorshSchema {
    return BorshSchema.from('u8');
  }

  static get u16(): BorshSchema {
    return BorshSchema.from('u16');
  }

  static get u32(): BorshSchema {
    return BorshSchema.from('u32');
  }

  static get u64(): BorshSchema {
    return BorshSchema.from('u64');
  }

  static get u128(): BorshSchema {
    return BorshSchema.from('u128');
  }

  static get i8(): BorshSchema {
    return BorshSchema.from('i8');
  }

  static get i16(): BorshSchema {
    return BorshSchema.from('i16');
  }

  static get i32(): BorshSchema {
    return BorshSchema.from('i32');
  }

  static get i64(): BorshSchema {
    return BorshSchema.from('i64');
  }

  static get i128(): BorshSchema {
    return BorshSchema.from('i128');
  }

  static get f32(): BorshSchema {
    return BorshSchema.from('f32');
  }

  static get f64(): BorshSchema {
    return BorshSchema.from('f64');
  }

  static get bool(): BorshSchema {
    return BorshSchema.from('bool');
  }

  static get String(): BorshSchema {
    return BorshSchema.from('string');
  }
}
