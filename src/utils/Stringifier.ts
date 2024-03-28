import { Buffer } from 'buffer';
import { BorshSchema, borshSerialize } from 'borsher';
import { MaybeUint8Array } from '../types';

export type Stringify<T> = (data: T) => Buffer;

export class Stringifier<T> {
  stringify: Stringify<T>;

  private constructor(stringify: Stringify<T>) {
    this.stringify = stringify;
  }

  static json<T>(): Stringifier<T> {
    return new Stringifier((data) => Buffer.from(JSON.stringify(data)));
  }

  static borsh<T>(schema: BorshSchema): Stringifier<T> {
    return new Stringifier((data) => borshSerialize(schema, data));
  }

  static custom<T>(stringify: Stringify<T>): Stringifier<T> {
    return new Stringifier(stringify);
  }

  stringifyOrSkip(data: MaybeUint8Array<T>): Buffer {
    if (data instanceof Uint8Array) {
      return Buffer.from(data);
    } else {
      return this.stringify(data);
    }
  }
}
