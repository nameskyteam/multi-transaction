import { Buffer } from 'buffer';
import { Stringifier } from '../types';

/**
 * Serialize data with given function, if data type is `Uint8Array`, skip serialize.
 */
export function stringifyOrSkip<T>(data: T | Uint8Array, stringify: Stringifier<T>): Buffer {
  const isUint8Array =
    (data as Uint8Array).byteLength && (data as Uint8Array).byteLength === (data as Uint8Array).length;
  return isUint8Array ? Buffer.from(data as Uint8Array) : stringify(data as T);
}

/**
 * Serialize data in JSON format.
 */
export function stringifyJson<T>(data: T): Buffer {
  return Buffer.from(JSON.stringify(data));
}

/**
 * Deserialize data in JSON format.
 */
export function parseJson<T>(data: Uint8Array): T {
  return JSON.parse(Buffer.from(data).toString());
}
