import { Buffer } from 'buffer';

/**
 * Deserialize data in JSON format.
 */
export function jsonParse<T>(buffer: Uint8Array): T {
  return JSON.parse(Buffer.from(buffer).toString());
}
