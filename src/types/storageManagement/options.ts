import { StorageDepositArgs, StorageUnregisterArgs, StorageWithdrawArgs } from './args';
import { CamelCaseKeys } from 'camelcase-keys';

export type StorageDepositOptions = {
  args?: CamelCaseKeys<StorageDepositArgs>;
  attachedDeposit: string;
  gas?: string;
};

export type StorageWithdrawOptions = {
  args?: CamelCaseKeys<StorageWithdrawArgs>;
  gas?: string;
};

export type StorageUnregisterOptions = {
  args?: CamelCaseKeys<StorageUnregisterArgs>;
  gas?: string;
};
