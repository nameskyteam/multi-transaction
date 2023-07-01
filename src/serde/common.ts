import { Buffer } from 'buffer';
import { parseJson, stringifyJson } from './json';
import { BorshSchema, parseBorsh, stringifyBorsh } from './borsh';
import { AssignableClass, unreachable } from '../utils';

export type Stringifier = <T>(data: T) => Buffer;
export type StringifyOptions = Stringifier | 'json' | StringifyBorshOptions;
export interface StringifyBorshOptions {
  method: 'borsh';
  schema: BorshSchema;
}

/**
 * Serialize data with given options, if data type is `Uint8Array`, skip serialize.
 */
export function stringifyOrSkip<T>(data: T | Uint8Array, options: StringifyOptions): Buffer {
  const isUint8Array =
    (data as Uint8Array).byteLength && (data as Uint8Array).byteLength === (data as Uint8Array).length;
  return isUint8Array ? Buffer.from(data as Uint8Array) : getStringifier(options)(data as T);
}

export function getStringifier(options: StringifyOptions): Stringifier {
  if (typeof options === 'function') {
    return options;
  } else if (options === 'json') {
    return stringifyJson;
  } else if (options.method === 'borsh') {
    return <T>(data: T) => stringifyBorsh<T>(options.schema, data);
  } else {
    unreachable();
  }
}

export type Parser<T> = (data: Uint8Array) => T;
export type ParseOptions<T> = Parser<T> | 'json' | ParseBorshOptions<T>;
export interface ParseBorshOptions<T> {
  method: 'borsh';
  schema: BorshSchema;
  dataClass: AssignableClass<T>;
}

export function getParser<T>(options: ParseOptions<T>): Parser<T> {
  if (typeof options === 'function') {
    return options;
  } else if (options === 'json') {
    return parseJson;
  } else if (options.method === 'borsh') {
    return (data) => parseBorsh<T>(options.schema, data, options.dataClass);
  } else {
    unreachable();
  }
}
