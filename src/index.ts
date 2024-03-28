import { BigNumber } from 'bignumber.js';
import {
  MultiAction,
  MultiTransaction,
  MultiSendAccount,
  MultiSendAccountCallOptions,
  MultiSendAccountCallRawOptions,
  MultiSendAccountSendOptions,
  MultiSendAccountSendRawOptions,
  setupMultiSendWalletSelector,
} from './core';
import {
  MultiSendWalletSelectorOptions,
  MultiSendWalletSelector,
  MultiSendWalletSelectorCallOptions,
  MultiSendWalletSelectorCallRawOptions,
  MultiSendWalletSelectorSendOptions,
  MultiSendWalletSelectorSendRawOptions,
  View,
  ViewOptions,
  Call,
  CallOptions,
  CallRawOptions,
  Send,
  SendOptions,
  SendRawOptions,
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
  parseOutcome,
} from './utils';

BigNumber.config({
  DECIMAL_PLACES: 100,
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
});

export { MultiAction, MultiTransaction, EmptyArgs };
export {
  MultiSendAccount, MultiSendAccountCallOptions,
  MultiSendAccountCallRawOptions,
  MultiSendAccountSendOptions,
  MultiSendAccountSendRawOptions,
};
export {
  MultiSendWalletSelector,
  MultiSendWalletSelectorCallOptions,
  MultiSendWalletSelectorCallRawOptions,
  MultiSendWalletSelectorSendOptions,
  MultiSendWalletSelectorSendRawOptions,
};
export { MultiSendWalletSelectorOptions, setupMultiSendWalletSelector };
export { View, ViewOptions, Call, CallOptions, CallRawOptions, Send, SendOptions, SendRawOptions };
export { BlockQuery, BlockQueryProvider, BlockWithHeader, Stringifier, Parser, parseOutcome };
export { BigNumber, Numeric, Amount, AmountUnits, Gas, GasUnits };
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
