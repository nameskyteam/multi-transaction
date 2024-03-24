import { EmptyArgs } from '../../core';

export type FtTransferArgs = {
  receiver_id: string;
  amount: string;
  memo?: string;
};

export type FtTransferCallArgs = {
  receiver_id: string;
  amount: string;
  memo?: string;
  msg: string;
};

export type FtBalanceOfArgs = {
  account_id: string;
};

export type FtTotalSupplyArgs = EmptyArgs;

export type FtMetadataArgs = EmptyArgs;
