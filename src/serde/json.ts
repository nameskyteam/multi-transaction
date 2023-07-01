import { Buffer } from 'buffer';

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
