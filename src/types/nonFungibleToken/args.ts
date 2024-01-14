export interface NftTransferArgs {
  receiver_id: string;
  token_id: string;
  approval_id?: number;
  memo?: string;
}

export interface NftTransferCallArgs {
  receiver_id: string;
  token_id: string;
  approval_id?: number;
  memo?: string;
  msg: string;
}

export interface NftTokenArgs {
  token_id: string;
}

export interface NftApproveArgs {
  token_id: string;
  account_id: string;
  msg?: string;
}

export interface NftRevokeArgs {
  token_id: string;
  account_id: string;
}

export interface NftRevokeAllArgs {
  token_id: string;
}

export interface NftIsApprovedArgs {
  token_id: string;
  approved_account_id: string;
  approval_id?: number;
}

export interface NftMetadataArgs {}

export interface NftTotalSupplyArgs {}

export interface NftTokensArgs {
  from_index?: string;
  limit?: number;
}

export interface NftSupplyForOwnerArgs {
  account_id: string;
}

export interface NftTokensForOwnerArgs {
  account_id: string;
  from_index?: string;
  limit?: number;
}
