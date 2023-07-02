import { Buffer } from 'buffer';
import { parseJson, stringifyJson } from './json';
import { BorshSchema, BorshType, parseBorsh, stringifyBorsh } from './borsh';
import { AssignableClass, unreachable } from '../utils';
import { Optional } from '../types';

export type Stringify<T> = Stringifier<T> | 'json' | Optional<Borsh<T>, 'dataType'>;
export type Stringifier<T> = (data: T) => Buffer;
export type Parse<T> = Parser<T> | 'json' | Borsh<T>;
export type Parser<T> = (data: Uint8Array) => T;

export interface Borsh<T> {
  method: 'borsh';
  schema: BorshSchema;
  dataType: AssignableClass<T> | Exclude<BorshType, AssignableClass<unknown>>;
}

/**
 * Serialize data, if data type is `Uint8Array`, skip serialize.
 * @param data data to serialize
 * @param stringify Stringify options. Default in JSON format
 */
export function stringifyOrSkip<T>(data: T | Uint8Array, stringify?: Stringify<T>): Buffer {
  const isUint8Array =
    (data as Uint8Array).byteLength && (data as Uint8Array).byteLength === (data as Uint8Array).length;
  return isUint8Array ? Buffer.from(data as Uint8Array) : getStringifier(stringify)(data as T);
}

/**
 * Get a serialize function.
 * @param stringify Stringify options. Default in JSON format
 */
export function getStringifier<T>(stringify?: Stringify<T>): Stringifier<T> {
  if (typeof stringify === 'function') {
    return stringify;
  } else if (!stringify || stringify === 'json') {
    return stringifyJson;
  } else if (stringify.method === 'borsh') {
    return (data) => stringifyBorsh(stringify.schema, data, stringify.dataType);
  } else {
    unreachable();
  }
}

/**
 * Get a deserialize function.
 * @param parse Parse options. Default in JSON format
 */
export function getParser<T>(parse?: Parse<T>): Parser<T> {
  if (typeof parse === 'function') {
    return parse;
  } else if (!parse || parse === 'json') {
    return parseJson;
  } else if (parse.method === 'borsh') {
    return (data) => parseBorsh(parse.schema, data, parse.dataType);
  } else {
    unreachable();
  }
}
