import { StorageDepositArgs, StorageUnregisterArgs, StorageWithdrawArgs } from './args';
import { CamelCaseKeys } from 'camelcase-keys';

export interface StorageDepositOptions {
  args?: CamelCaseKeys<StorageDepositArgs>;
  attachedDeposit: string;
  gas?: string;
}

export interface StorageWithdrawOptions {
  args?: CamelCaseKeys<StorageWithdrawArgs>;
  gas?: string;
}

export interface StorageUnregisterOptions {
  args?: CamelCaseKeys<StorageUnregisterArgs>;
  gas?: string;
}
