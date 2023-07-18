import { Buffer } from 'buffer';
import { jsonParser, jsonStringifier } from './json';
import { borshParser, borshStringifier, WrapperClass } from './borsh';
import { unreachable } from '../utils';
import { Class } from '../types';

export type Stringify<T> = Stringifier<T> | 'json' | 'borsh';
export type Stringifier<T> = (data: T) => Buffer;
export type Parse<T> = Parser<T> | 'json' | ParseBorsh<T>;
export type Parser<T> = (data: Uint8Array) => T;

export interface ParseBorsh<T> {
  method: 'borsh';
  type: Class<T> | WrapperClass<T>;
}

/**
 * Serialize data, if data type is `Uint8Array`, skip serialize.
 * @param data Data to serialize
 * @param stringify Stringify options
 */
export function stringifyOrSkip<T>(data: T | Uint8Array, stringify: Stringify<T>): Buffer {
  const isUint8Array =
    (data as Uint8Array).byteLength && (data as Uint8Array).byteLength === (data as Uint8Array).length;
  return isUint8Array ? Buffer.from(data as Uint8Array) : getStringifier(stringify)(data as T);
}

/**
 * Get a serialize function.
 * @param stringify Stringify options
 */
export function getStringifier<T>(stringify: Stringify<T>): Stringifier<T> {
  if (typeof stringify === 'function') {
    return stringify;
  } else if (!stringify || stringify === 'json') {
    return jsonStringifier;
  } else if (stringify === 'borsh') {
    return borshStringifier;
  } else {
    unreachable();
  }
}

/**
 * Get a deserialize function.
 * @param parse Parse options
 */
export function getParser<T>(parse: Parse<T>): Parser<T> {
  if (typeof parse === 'function') {
    return parse;
  } else if (!parse || parse === 'json') {
    return jsonParser;
  } else if (parse.method === 'borsh') {
    return (data) => borshParser(data, parse.type);
  } else {
    unreachable();
  }
}
