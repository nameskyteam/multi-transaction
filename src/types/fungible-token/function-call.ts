import { FtTransferArgs, FtTransferCallArgs } from './args';

export type FungibleTokenFunctionCall<T> = {
  /**
   * Add a FunctionCall Action with method `ft_transfer` following the previous one
   */
  transfer: (options: FtTransferOptions) => T;

  /**
   * Add a FunctionCall Action with method `ft_transfer_call` following the previous one
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
