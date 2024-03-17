import { NftTransferArgs, NftTransferCallArgs, NftApproveArgs, NftRevokeArgs, NftRevokeAllArgs } from './args';
import { CamelCaseKeys } from 'camelcase-keys';

export interface NftTransferOptions {
  args: CamelCaseKeys<NftTransferArgs>;
  gas?: string;
}

export interface NftTransferCallOptions {
  args: CamelCaseKeys<NftTransferCallArgs>;
  gas?: string;
}

export interface NftApproveOptions {
  args: CamelCaseKeys<NftApproveArgs>;
  attachedDeposit?: string;
  gas?: string;
}

export interface NftRevokeOptions {
  args: CamelCaseKeys<NftRevokeArgs>;
  gas?: string;
}

export interface NftRevokeAllOptions {
  args: CamelCaseKeys<NftRevokeAllArgs>;
  gas?: string;
}
