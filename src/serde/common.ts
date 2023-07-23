import { Buffer } from 'buffer';
import { jsonParser, jsonStringifier } from './json';

export type Stringify<T> = Stringifier<T> | 'json';
export type Stringifier<T> = (data: T) => Buffer;
export type Parse<T> = Parser<T> | 'json';
export type Parser<T> = (data: Uint8Array) => T;

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
  } else {
    return jsonStringifier;
  }
}

/**
 * Get a deserialize function.
 * @param parse Parse options
 */
export function getParser<T>(parse: Parse<T>): Parser<T> {
  if (typeof parse === 'function') {
    return parse;
  } else {
    return jsonParser;
  }
}
