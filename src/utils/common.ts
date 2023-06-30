import { Stringifier } from '../types';
import { Buffer } from 'buffer';

/**
 * Serialize data with given function, if data type is `Uint8Array`, skip serialize.
 */
export function stringifyOrSkip<T>(data: T | Uint8Array, stringify: Stringifier<T>): Buffer {
  const isUint8Array =
    (data as Uint8Array).byteLength && (data as Uint8Array).byteLength === (data as Uint8Array).length;
  return isUint8Array ? Buffer.from(data as Uint8Array) : stringify(data as T);
}
