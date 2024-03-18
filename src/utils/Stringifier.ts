import { Buffer } from 'buffer';
import { BorshSchema, borshSerialize } from 'borsher';

export type StringifierKind = 'json' | 'borsh' | 'custom';
export type Stringify<T> = (data: T) => Buffer;

export class Stringifier<T> {
  readonly kind: StringifierKind;
  stringify: Stringify<T>;

  private constructor(kind: StringifierKind, stringify: Stringify<T>) {
    this.kind = kind;
    this.stringify = stringify;
  }

  static json<T>(): Stringifier<T> {
    return new Stringifier('json', (data) => Buffer.from(JSON.stringify(data)));
  }

  static borsh<T>(schema: BorshSchema): Stringifier<T> {
    return new Stringifier('borsh', (data) => borshSerialize(schema, data));
  }

  static custom<T>(stringify: Stringify<T>): Stringifier<T> {
    return new Stringifier('custom', stringify);
  }

  stringifyOrSkip(data: T): Buffer {
    if ('byteLength' in data && 'length' in data && 'buffer' in data) {
      return Buffer.from(data as Uint8Array);
    } else {
      return this.stringify(data);
    }
  }
}
