import { Buffer } from 'buffer';
import { parseJson, stringifyJson } from './json';
import { BorshSchema, parseBorsh, stringifyBorsh } from './borsh';
import { AssignableClass, unreachable } from '../utils';

export type Stringify = Stringifier | 'json' | Omit<Borsh<unknown>, 'dataClass'>;
export type Stringifier = <T>(data: T) => Buffer;
export type Parse<T> = Parser<T> | 'json' | Borsh<T>;
export type Parser<T> = (data: Uint8Array) => T;

export interface Borsh<T> {
  method: 'borsh';

  /**
   * borsh schema
   */
  schema: BorshSchema;

  /**
   * required when parse data from borsh bytes
   */
  dataClass: AssignableClass<T>;
}

/**
 * Serialize data, if data type is `Uint8Array`, skip serialize.
 */
export function stringifyOrSkip<T>(data: T | Uint8Array, stringify: Stringify): Buffer {
  const isUint8Array =
    (data as Uint8Array).byteLength && (data as Uint8Array).byteLength === (data as Uint8Array).length;
  return isUint8Array ? Buffer.from(data as Uint8Array) : getStringifier(stringify)(data as T);
}

export function getStringifier(stringify: Stringify): Stringifier {
  if (typeof stringify === 'function') {
    return stringify;
  } else if (stringify === 'json') {
    return stringifyJson;
  } else if (stringify.method === 'borsh') {
    return (data) => stringifyBorsh(stringify.schema, data);
  } else {
    unreachable();
  }
}

export function getParser<T>(parse: Parse<T>): Parser<T> {
  if (typeof parse === 'function') {
    return parse;
  } else if (parse === 'json') {
    return parseJson;
  } else if (parse.method === 'borsh') {
    return (data) => parseBorsh(parse.schema, data, parse.dataClass);
  } else {
    unreachable();
  }
}
