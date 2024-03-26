import { NftTransferArgs, NftTransferCallArgs, NftApproveArgs, NftRevokeArgs, NftRevokeAllArgs } from './args';

export type NonFungibleTokenFunctionCall<T> = {
  transfer: (options: NftTransferOptions) => T;
  transfer_call: (options: NftTransferCallOptions) => T;
  approve: (options: NftApproveOptions) => T;
  revoke: (options: NftRevokeOptions) => T;
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
