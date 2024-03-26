import { StorageDepositArgs, StorageWithdrawArgs, StorageUnregisterArgs } from './args';

export type StorageManagementFunctionCall<T> = {
  deposit: (options: StorageDepositOptions) => T;
  withdraw: (options: StorageWithdrawOptions) => T;
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
