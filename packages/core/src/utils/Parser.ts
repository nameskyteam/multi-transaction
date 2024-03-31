import { borshDeserialize, BorshSchema } from 'borsher';
import { Buffer } from 'buffer';

export type Parse<T> = (buffer: Uint8Array) => T;

export class Parser<T> {
  parse: Parse<T>;

  private constructor(parse: Parse<T>) {
    this.parse = parse;
  }

  static json<T>(): Parser<T> {
    return new Parser((buffer) => JSON.parse(Buffer.from(buffer).toString()));
  }

  static borsh<T>(schema: BorshSchema): Parser<T> {
    return new Parser((buffer) => borshDeserialize(schema, buffer));
  }

  static custom<T>(parse: Parse<T>): Parser<T> {
    return new Parser(parse);
  }
}
