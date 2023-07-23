import { BlockReference } from 'near-api-js/lib/providers/provider';
import { Parse, Stringify } from '../serde';

export interface FunctionCallOptions<Args> {
  /**
   * Method name
   */
  methodName: string;

  /**
   * Method args
   */
  args?: Args | Uint8Array;

  /**
   * Attached yocto NEAR amount
   */
  attachedDeposit?: string;

  /**
   * Prepaid gas
   */
  gas?: string;

  /**
   * Serialize args into bytes
   */
  stringify?: Stringify<Args>;
}

export interface ViewOptions<Value, Args> {
  /**
   * Contract id
   */
  contractId: string;

  /**
   * Method name
   */
  methodName: string;

  /**
   * Method args
   */
  args?: Args | Uint8Array;

  /**
   * Serialize args into bytes
   */
  stringify?: Stringify<Args>;

  /**
   * Deserialize returned value from bytes
   */
  parse?: Parse<Value>;

  /**
   * View contract method in the past block
   */
  blockQuery?: BlockQuery;
}

export interface CallOptions<Value, Args> extends FunctionCallOptions<Args>, SendOptions<Value> {
  /**
   * Contract id
   */
  contractId: string;
}

export type CallRawOptions<Args> = Omit<CallOptions<unknown, Args>, 'parse'>;

export interface SendOptions<Value> {
  throwReceiptErrors?: boolean;

  /**
   * Deserialize returned value from bytes
   */
  parse?: Parse<Value>;
}

export type SendRawOptions = Omit<SendOptions<unknown>, 'parse'>;

export interface EmptyArgs {}

export type BlockQuery = BlockReference;
