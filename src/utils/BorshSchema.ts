import * as borsh from 'borsh';

interface ExternalStructFields {
  [k: string]: borsh.Schema;
}

export interface StructFields {
  [k: string]: BorshSchema;
}

export interface EnumVariants {
  [k: string]: BorshSchema;
}

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
  static Struct(fields: StructFields): BorshSchema {
    return BorshSchema.from({
      struct: Object.entries(fields).reduce<ExternalStructFields>((fields, [key, value]) => {
        fields[key] = value.into();
        return fields;
      }, {}),
    });
  }

  static Array(element: BorshSchema, len: number): BorshSchema {
    return BorshSchema.from({ array: { type: element.into(), len } });
  }

  static Vec(element: BorshSchema): BorshSchema {
    return BorshSchema.from({ array: { type: element.into() } });
  }

  static HashSet(element: BorshSchema): BorshSchema {
    return BorshSchema.from({ set: element.into() });
  }

  static HashMap(key: BorshSchema, value: BorshSchema): BorshSchema {
    return BorshSchema.from({ map: { key: key.into(), value: value.into() } });
  }

  // -------------------------------------- enum ------------------------------------------
  static Enum(variants: EnumVariants): BorshSchema {
    return BorshSchema.from({
      enum: Object.entries(variants).map(([key, value]) => {
        return { struct: { [key]: value.into() } };
      }),
    });
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
