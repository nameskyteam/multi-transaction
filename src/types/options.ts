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
  args?: Args;

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
   * Method args
   */
  args?: Args;

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

export type BlockQuery = BlockReference;
