import borsh from 'borsh';
import { BorshSchema } from '../utils';

/**
 * Deserialize data in borsh format.
 */
export function borshParse<T>(schema: BorshSchema, buffer: Uint8Array): T {
  return borsh.deserialize(schema.into(), buffer) as T;
}
