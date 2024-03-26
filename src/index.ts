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
  EmptyArgs,
  FunctionCallOptions,
  MultiSendWalletSelectorOptions,
  MultiSendWalletSelector,
  IsLoginAccessKeyActiveOptions,
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
} from './types';
import { Amount, AmountUnits, Gas, GasUnits, BlockQuery, Parser, Stringifier, parseOutcome } from './utils';

BigNumber.config({
  DECIMAL_PLACES: 100,
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
});

export { MultiAction, MultiTransaction, FunctionCallOptions, EmptyArgs };
export {
  MultiSendAccount,
  MultiSendAccountCallOptions,
  MultiSendAccountCallRawOptions,
  MultiSendAccountSendOptions,
  MultiSendAccountSendRawOptions,
};
export {
  MultiSendWalletSelector,
  IsLoginAccessKeyActiveOptions,
  MultiSendWalletSelectorCallOptions,
  MultiSendWalletSelectorCallRawOptions,
  MultiSendWalletSelectorSendOptions,
  MultiSendWalletSelectorSendRawOptions,
};
export { MultiSendWalletSelectorOptions, setupMultiSendWalletSelector };
export { View, ViewOptions, Call, CallOptions, CallRawOptions, Send, SendOptions, SendRawOptions };
export { BlockQuery, Stringifier, Parser, parseOutcome };
export { BigNumber, Numeric, Amount, AmountUnits, Gas, GasUnits };
export { BorshSchema, borshSerialize, borshDeserialize, StructFields, EnumVariants, Unit } from 'borsher';
export * from './types/fungible-token/args';
export * from './types/fungible-token/value';
export * from './types/non-fungible-token/args';
export * from './types/non-fungible-token/value';
export * from './types/storage-management/args';
export * from './types/storage-management/value';
