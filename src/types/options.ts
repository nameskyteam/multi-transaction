import { BlockReference } from 'near-api-js/lib/providers/provider';
import { Parse, Stringify } from '../serde';

export interface FunctionCallOptions<Args> {
  /**
   * Method name
   */
  methodName: string;

  /**
   * Serializable types or `Uint8Array`. Default `{}`
   */
  args?: Args | Uint8Array;

  /**
   * Attached yocto NEAR amount. Default 0 yocto NEAR
   */
  attachedDeposit?: string;

  /**
   * Prepaid gas. Default 30 Tera
   */
  gas?: string;

  /**
   * Serialize args into bytes if args type is not `Uint8Array`. Default in JSON format
   */
  stringify?: Stringify<Args>;
}

export interface ViewFunctionOptions<Value, Args> {
  /**
   * Contract id
   */
  contractId: string;

  /**
   * Method name
   */
  methodName: string;

  /**
   * Serializable types or `Uint8Array`. Default `{}`
   */
  args?: Args | Uint8Array;

  /**
   * Serialize args into bytes if args type is not `Uint8Array`. Default in JSON format
   */
  stringify?: Stringify<Args>;

  /**
   * Deserialize returned value from bytes. Default in JSON format
   */
  parse?: Parse<Value>;

  /**
   * View contract method in the past block
   */
  blockQuery?: BlockQuery;
}

export type EmptyObject = Record<string, never>;
export type BlockQuery = BlockReference;
