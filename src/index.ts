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
  EmptyArgs,
  Numeric,
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
export { BlockQuery, BlockQueryProvider, BlockWithHeader, Stringifier, Parser, parseOutcome };
export { BigNumber, Numeric, Amount, AmountUnits, Gas, GasUnits };
export { BorshSchema, borshSerialize, borshDeserialize, StructFields, EnumVariants, Unit } from 'borsher';
export * from './types/fungible-token/args';
export * from './types/fungible-token/value';
export * from './types/non-fungible-token/args';
export * from './types/non-fungible-token/value';
export * from './types/storage-management/args';
export * from './types/storage-management/value';
