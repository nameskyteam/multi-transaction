import { Buffer } from 'buffer';

/**
 * Serialize data in JSON format.
 */
export function jsonStringify<T>(data: T): Buffer {
  return Buffer.from(JSON.stringify(data));
}
