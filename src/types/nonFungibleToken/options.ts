import { NftTransferArgs, NftTransferCallArgs, NftApproveArgs, NftRevokeArgs, NftRevokeAllArgs } from './args';
import { CamelCaseKeys } from 'camelcase-keys';

export type NftTransferOptions = {
  args: CamelCaseKeys<NftTransferArgs>;
  gas?: string;
};

export type NftTransferCallOptions = {
  args: CamelCaseKeys<NftTransferCallArgs>;
  gas?: string;
};

export type NftApproveOptions = {
  args: CamelCaseKeys<NftApproveArgs>;
  attachedDeposit?: string;
  gas?: string;
};

export type NftRevokeOptions = {
  args: CamelCaseKeys<NftRevokeArgs>;
  gas?: string;
};

export type NftRevokeAllOptions = {
  args: CamelCaseKeys<NftRevokeAllArgs>;
  gas?: string;
};
