import { jsonParse } from './json';
import { borshParse } from './borsh';
import { BorshSchema } from '../utils';

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
    return new Parser<T>('json', jsonParse);
  }

  static borsh<T>(schema: BorshSchema): Parser<T> {
    return new Parser('borsh', (buffer) => borshParse(schema, buffer));
  }

  static custom<T>(parse: Parse<T>): Parser<T> {
    return new Parser('custom', parse);
  }
}
