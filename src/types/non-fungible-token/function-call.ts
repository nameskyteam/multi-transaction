import { NftTransferArgs, NftTransferCallArgs, NftApproveArgs, NftRevokeArgs, NftRevokeAllArgs } from './args';

export type NonFungibleTokenFunctionCall<T> = {
  /**
   * Add a FunctionCall Action with method `nft_transfer` following the previous one
   */
  transfer: (options: NftTransferOptions) => T;

  /**
   * Add a FunctionCall Action with method `nft_transfer_call` following the previous one
   */
  transfer_call: (options: NftTransferCallOptions) => T;

  /**
   * Add a FunctionCall Action with method `nft_approve` following the previous one
   */
  approve: (options: NftApproveOptions) => T;

  /**
   * Add a FunctionCall Action with method `nft_revoke` following the previous one
   */
  revoke: (options: NftRevokeOptions) => T;

  /**
   * Add a FunctionCall Action with method `nft_revoke_all` following the previous one
   */
  revoke_all: (options: NftRevokeAllOptions) => T;
};

export type NftTransferOptions = {
  args: NftTransferArgs;
  gas?: string;
};

export type NftTransferCallOptions = {
  args: NftTransferCallArgs;
  gas?: string;
};

export type NftApproveOptions = {
  args: NftApproveArgs;
  attachedDeposit?: string;
  gas?: string;
};

export type NftRevokeOptions = {
  args: NftRevokeArgs;
  gas?: string;
};

export type NftRevokeAllOptions = {
  args: NftRevokeAllArgs;
  gas?: string;
};
