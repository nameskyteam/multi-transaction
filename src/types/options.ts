import { BlockReference } from 'near-api-js/lib/providers/provider';
import { Buffer } from 'buffer';

export interface FunctionCallOptions<Args> {
  /**
   * Method name
   */
  methodName: string;

  /**
   * `Uint8Array` or serializable types. Default `{}`
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
  stringify?: Stringifier<Args>;
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
   * `Uint8Array` or serializable types. Default `{}`
   */
  args?: Args | Uint8Array;

  /**
   * Serialize args into bytes if args type is not `Uint8Array`. Default in JSON format
   */
  stringify?: Stringifier<Args>;

  /**
   * Deserialize returned value from bytes. Default in JSON format
   */
  parse?: Parser<Value>;

  /**
   * View contract method in the past block
   */
  blockQuery?: BlockQuery;
}

export type ArgsOptions<Args> = Pick<FunctionCallOptions<Args>, 'args'>;
export type AttachedDepositOptions = Pick<FunctionCallOptions<unknown>, 'attachedDeposit'>;
export type GasOptions = Pick<FunctionCallOptions<unknown>, 'gas'>;

export type BlockQuery = BlockReference;

export type EmptyObject = Record<string, never>;

export type Stringifier<T> = (data: T) => Buffer;
export type Parser<T> = (data: Uint8Array) => T;
