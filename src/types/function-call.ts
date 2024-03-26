import { FtTransferCallOptions, FtTransferOptions } from './fungible-token';
import {
  NftApproveOptions,
  NftRevokeAllOptions,
  NftRevokeOptions,
  NftTransferCallOptions,
  NftTransferOptions,
} from './non-fungible-token';
import { StorageDepositOptions, StorageUnregisterOptions, StorageWithdrawOptions } from './storage-management';
import { Stringifier } from '../utils';

export type FunctionCallOptions<Args> = {
  methodName: string;
  args?: Args;
  attachedDeposit?: string;
  gas?: string;
  stringifier?: Stringifier<Args>;
};

export type FunctionCall<T> = <Args>(options: FunctionCallOptions<Args>) => T;

export type FungibleTokenFunctionCall<T> = {
  transfer(options: FtTransferOptions): T;
  transfer_call(options: FtTransferCallOptions): T;
};

export type NonFungibleTokenFunctionCall<T> = {
  transfer(options: NftTransferOptions): T;
  transfer_call(options: NftTransferCallOptions): T;
  approve(options: NftApproveOptions): T;
  revoke(options: NftRevokeOptions): T;
  revoke_all(options: NftRevokeAllOptions): T;
};

export type StorageManagementFunctionCall<T> = {
  deposit(options: StorageDepositOptions): T;
  withdraw(options: StorageWithdrawOptions): T;
  unregister(options: StorageUnregisterOptions): T;
};
