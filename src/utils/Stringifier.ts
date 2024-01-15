import * as borsh from 'borsh';
import { Buffer } from 'buffer';
import { BorshSchema } from './index';

export type StringifierKind = 'json' | 'borsh' | 'custom';
export type Stringify<T> = (data: T) => Buffer;

export class Stringifier<T> {
  kind: StringifierKind;
  stringify: Stringify<T>;

  private constructor(kind: StringifierKind, stringify: Stringify<T>) {
    this.kind = kind;
    this.stringify = stringify;
  }

  static json<T>(): Stringifier<T> {
    return new Stringifier('json', jsonStringify);
  }

  static borsh<T>(schema: BorshSchema): Stringifier<T> {
    return new Stringifier('borsh', (data) => borshStringify(schema, data));
  }

  static custom<T>(stringify: Stringify<T>): Stringifier<T> {
    return new Stringifier('custom', stringify);
  }

  stringifyOrSkip(data: T | Uint8Array): Buffer {
    if ('byteLength' in data && 'length' in data) {
      return Buffer.from(data);
    } else {
      return this.stringify(data);
    }
  }
}

/**
 * Serialize data in JSON format.
 */
export function jsonStringify<T>(data: T): Buffer {
  return Buffer.from(JSON.stringify(data));
}

/**
 * Serialize data in borsh format.
 */
export function borshStringify<T>(schema: BorshSchema, data: T): Buffer {
  return Buffer.from(borsh.serialize(schema.into(), data));
}
