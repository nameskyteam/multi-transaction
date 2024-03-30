export type NftTransferArgs = {
  receiver_id: string;
  token_id: string;
  approval_id?: number;
  memo?: string;
};

export type NftTransferCallArgs = {
  receiver_id: string;
  token_id: string;
  approval_id?: number;
  memo?: string;
  msg: string;
};

export type NftTokenArgs = {
  token_id: string;
};

export type NftApproveArgs = {
  token_id: string;
  account_id: string;
  msg?: string;
};

export type NftRevokeArgs = {
  token_id: string;
  account_id: string;
};

export type NftRevokeAllArgs = {
  token_id: string;
};

export type NftIsApprovedArgs = {
  token_id: string;
  approved_account_id: string;
  approval_id?: number;
};

export type NftTokensArgs = {
  from_index?: string;
  limit?: number;
};

export type NftSupplyForOwnerArgs = {
  account_id: string;
};

export type NftTokensForOwnerArgs = {
  account_id: string;
  from_index?: string;
  limit?: number;
};
