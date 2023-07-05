import { Buffer } from 'buffer';

/**
 * Serialize data in JSON format.
 */
export function jsonStringifier<T>(data: T): Buffer {
  return Buffer.from(JSON.stringify(data));
}

/**
 * Deserialize data in JSON format.
 */
export function jsonParser<T>(buffer: Uint8Array): T {
  return JSON.parse(Buffer.from(buffer).toString());
}
