import { StorageDepositArgs, StorageUnregisterArgs, StorageWithdrawArgs } from './args';

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
