import { BigNumber } from 'bignumber.js';
import {
  EmptyArgs,
  FunctionCallOptions,
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
  BigNumberLike,
} from './types';
import { Amount, Gas, BlockQuery, Parser, Stringifier, parseOutcomeValue } from './utils';

BigNumber.config({
  DECIMAL_PLACES: 100,
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
});

export { EmptyArgs, FunctionCallOptions, MultiTransaction };
export {
  MultiSendAccount,
  MultiSendAccountCallOptions,
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
export { BlockQuery, Amount, Gas, Stringifier, Parser, parseOutcomeValue };
export { BigNumber, BigNumberLike };
export * from './types/fungibleToken/args';
export * from './types/fungibleToken/value';
export * from './types/nonFungibleToken/args';
export * from './types/nonFungibleToken/value';
export * from './types/storageManagement/args';
export * from './types/storageManagement/value';
export * from 'borsher';
