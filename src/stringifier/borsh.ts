import borsh from 'borsh';
import { BorshSchema } from '../utils';

/**
 * Serialize data in borsh format.
 */
export function borshStringify<T>(schema: BorshSchema, data: T): Buffer {
  return Buffer.from(borsh.serialize(schema.into(), data));
}
