import { BlockReference } from 'near-api-js/lib/providers/provider';
import { Parser, Stringifier } from '../utils';

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
  stringifier?: Stringifier<Args>;
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
  stringifier?: Stringifier<Args>;

  /**
   * Deserialize returned value from bytes
   */
  parser?: Parser<Value>;

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

export type CallRawOptions<Args> = Omit<CallOptions<unknown, Args>, 'parser'>;

export interface SendOptions<Value> {
  throwReceiptErrors?: boolean;

  /**
   * Deserialize returned value from bytes
   */
  parser?: Parser<Value>;
}

export type SendRawOptions = Omit<SendOptions<unknown>, 'parser'>;

export type BlockQuery = BlockReference;
