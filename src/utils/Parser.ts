import { borshDeserialize, BorshSchema } from 'borsher';

export type ParserKind = 'json' | 'borsh' | 'custom';
export type Parse<T> = (buffer: Uint8Array) => T;

export class Parser<T> {
  kind: ParserKind;
  parse: Parse<T>;

  private constructor(kind: ParserKind, parse: Parse<T>) {
    this.kind = kind;
    this.parse = parse;
  }

  static json<T>(): Parser<T> {
    return new Parser<T>('json', (buffer) => JSON.parse(Buffer.from(buffer).toString()));
  }

  static borsh<T>(schema: BorshSchema): Parser<T> {
    return new Parser('borsh', (buffer) => borshDeserialize(schema, buffer));
  }

  static custom<T>(parse: Parse<T>): Parser<T> {
    return new Parser('custom', parse);
  }
}
