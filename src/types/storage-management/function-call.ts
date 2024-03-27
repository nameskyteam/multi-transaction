import { StorageDepositArgs, StorageWithdrawArgs, StorageUnregisterArgs } from './args';

export type StorageManagementFunctionCall<T> = {
  /**
   * Add a FunctionCall Action with method `storage_deposit` following previous actions
   */
  deposit: (options: StorageDepositOptions) => T;

  /**
   * Add a FunctionCall Action with method `storage_withdraw` following previous actions
   */
  withdraw: (options: StorageWithdrawOptions) => T;

  /**
   * Add a FunctionCall Action with method `storage_unregister` following previous actions
   */
  unregister: (options: StorageUnregisterOptions) => T;
};

export type StorageDepositOptions = {
  args?: StorageDepositArgs;
  attachedDeposit: string;
  gas?: string;
};

export type StorageWithdrawOptions = {
  args?: StorageWithdrawArgs;
  gas?: string;
};

export type StorageUnregisterOptions = {
  args?: StorageUnregisterArgs;
  gas?: string;
};
