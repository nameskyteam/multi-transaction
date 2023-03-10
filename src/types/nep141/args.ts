export interface FtTransferArgs {
  receiver_id: string;
  amount: string;
  memo?: string;
}

export interface FtTransferCallArgs {
  receiver_id: string;
  amount: string;
  memo?: string;
  msg: string;
}

export interface FtBalanceOfArgs {
  account_id: string;
}

export interface FtTotalSupplyArgs {}

export interface FtMetadataArgs {}
