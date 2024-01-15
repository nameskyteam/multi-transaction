import * as borsh from 'borsh';
import { BorshSchema } from './index';

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

/**
 * Deserialize data in JSON format.
 */
export function jsonParse<T>(buffer: Uint8Array): T {
  return JSON.parse(Buffer.from(buffer).toString());
}

/**
 * Deserialize data in borsh format.
 */
export function borshParse<T>(schema: BorshSchema, buffer: Uint8Array): T {
  return borsh.deserialize(schema.into(), buffer) as T;
}
