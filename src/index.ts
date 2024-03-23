import { BigNumber } from 'bignumber.js';
import { borshSerialize, borshDeserialize, BorshSchema, EnumVariants, StructFields, Unit } from 'borsher';
import {
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

export { MultiTransaction };
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
export { borshSerialize, borshDeserialize, BorshSchema, EnumVariants, StructFields, Unit };
export { BigNumber, BigNumberLike };
