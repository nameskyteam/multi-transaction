import { FtTransferArgs, FtTransferCallArgs } from './args';

export type FungibleTokenFunctionCall<T> = {
  transfer: (options: FtTransferOptions) => T;
  transfer_call: (options: FtTransferCallOptions) => T;
};

export type FtTransferOptions = {
  args: FtTransferArgs;
  gas?: string;
};

export type FtTransferCallOptions = {
  args: FtTransferCallArgs;
  gas?: string;
};
