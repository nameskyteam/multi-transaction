import { FtTransferArgs, FtTransferCallArgs } from './args';

export type FungibleTokenFunctionCall<T> = {
  /**
   * Add a FunctionCall Action with method `ft_transfer` following previous actions
   */
  transfer: (options: FtTransferOptions) => T;

  /**
   * Add a FunctionCall Action with method `ft_transfer_call` following previous actions
   */
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
