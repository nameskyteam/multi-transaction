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
import { Amount, Gas, BlockQuery, Parser, Stringifier, parseOutcome } from './utils';

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
export { BlockQuery, Amount, Gas, Stringifier, Parser, parseOutcome };
export { BigNumber, BigNumberLike };
export * from './types/fungible-token/args';
export * from './types/fungible-token/value';
export * from './types/non-fungible-token/args';
export * from './types/non-fungible-token/value';
export * from './types/storage-management/args';
export * from './types/storage-management/value';
export * from 'borsher';
