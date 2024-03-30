import { BigNumber } from 'bignumber.js';
import { MultiAction, MultiTransaction } from './core';
import { SendTransactionError, UnreachableError } from './errors';
import {
  Transaction,
  Action,
  AccessKey,
  Send,
  SendOptions,
  SendRawOptions,
  Call,
  CallOptions,
  CallRawOptions,
  View,
  ViewOptions,
  Numeric,
  EmptyArgs,
  FtTransferArgs,
  FtTransferCallArgs,
  FtBalanceOfArgs,
  FungibleTokenMetadata,
  NftTransferArgs,
  NftTransferCallArgs,
  NftTokenArgs,
  NftApproveArgs,
  NftRevokeArgs,
  NftRevokeAllArgs,
  NftIsApprovedArgs,
  NftTokensArgs,
  NftSupplyForOwnerArgs,
  NftTokensForOwnerArgs,
  Token,
  TokenMetadata,
  NFTContractMetadata,
  StorageDepositArgs,
  StorageWithdrawArgs,
  StorageUnregisterArgs,
  StorageBalanceOfArgs,
  StorageBalance,
  StorageBalanceBounds,
} from './types';
import {
  Amount,
  AmountUnits,
  Gas,
  GasUnits,
  BlockQuery,
  BlockQueryProvider,
  BlockWithHeader,
  Parser,
  Stringifier,
  parseOutcomeValue,
  throwReceiptErrorsFromOutcomes,
} from './utils';

BigNumber.config({
  DECIMAL_PLACES: 100,
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
});

export { MultiTransaction, MultiAction, EmptyArgs };
export { Send, SendOptions, SendRawOptions, Call, CallOptions, CallRawOptions, View, ViewOptions };
export {
  BlockQuery,
  BlockQueryProvider,
  BlockWithHeader,
  Stringifier,
  Parser,
  parseOutcomeValue,
  throwReceiptErrorsFromOutcomes,
};
export { BigNumber, Numeric, Amount, AmountUnits, Gas, GasUnits };
export { Transaction, Action, AccessKey };
export { SendTransactionError, UnreachableError };
export { FtTransferArgs, FtTransferCallArgs, FtBalanceOfArgs, FungibleTokenMetadata };
export {
  NftTransferArgs,
  NftTransferCallArgs,
  NftTokenArgs,
  NftApproveArgs,
  NftRevokeArgs,
  NftRevokeAllArgs,
  NftIsApprovedArgs,
  NftTokensArgs,
  NftSupplyForOwnerArgs,
  NftTokensForOwnerArgs,
  Token,
  TokenMetadata,
  NFTContractMetadata,
};
export {
  StorageDepositArgs,
  StorageWithdrawArgs,
  StorageUnregisterArgs,
  StorageBalanceOfArgs,
  StorageBalance,
  StorageBalanceBounds,
};
export * from 'borsher';
