import { Parser, Stringifier } from '../utils';
import { BlockQuery } from '../utils/BlockQuery';

export type FunctionCallOptions<Args> = {
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
  stringifier?: Stringifier<Args>;
};

export type ViewOptions<Value, Args> = {
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
  stringifier?: Stringifier<Args>;

  /**
   * Deserialize returned value from bytes
   */
  parser?: Parser<Value>;

  /**
   * View contract method in the past block
   */
  blockQuery?: BlockQuery;
};

export type CallOptions<Value, Args> = {
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

  /**
   * Deserialize returned value from bytes
   */
  parser?: Parser<Value>;

  /**
   * Throw receipt errors if any
   */
  throwReceiptErrors?: boolean;
};

export type CallRawOptions<Args> = {
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

  /**
   * Throw receipt errors if any
   */
  throwReceiptErrors?: boolean;
};

export type SendOptions<Value> = {
  /**
   * Throw receipt errors if any
   */
  throwReceiptErrors?: boolean;

  /**
   * Deserialize returned value from bytes
   */
  parser?: Parser<Value>;
};

export type SendRawOptions = {
  /**
   * Throw receipt errors if any
   */
  throwReceiptErrors?: boolean;
};

export type EmptyArgs = {};
