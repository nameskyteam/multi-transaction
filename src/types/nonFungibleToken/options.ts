import { NftTransferArgs, NftTransferCallArgs, NftApproveArgs, NftRevokeArgs, NftRevokeAllArgs } from './args';

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
