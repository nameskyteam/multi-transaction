import { EmptyArgs } from '../function-call';

export type StorageDepositArgs = {
  account_id?: string;
  registration_only?: boolean;
};

export type StorageWithdrawArgs = {
  amount?: string;
};

export type StorageUnregisterArgs = {
  force?: boolean;
};

export type StorageBalanceOfArgs = {
  account_id: string;
};

export type StorageBalanceBoundsArgs = EmptyArgs;
