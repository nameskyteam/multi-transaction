import { AccountState, WalletSelector } from '@near-wallet-selector/core';
import { FinalExecutionOutcome } from '@near-js/types';
import { WalletSelectorParams } from '@near-wallet-selector/core/src/lib/wallet-selector.types';
import { Action as NearWalletSelectorAction } from '@near-wallet-selector/core/src/lib/wallet/transactions.types';
import {
  MultiTransaction,
  EmptyArgs,
  View,
  ViewOptions,
  Call,
  CallOptions,
  CallRawOptions,
  Send,
  SendOptions,
  SendRawOptions,
} from '@multi-transaction/core';

export interface MultiSendWalletSelector extends WalletSelector, Send, Call, View {
  /**
   * Account that is login
   */
  getActiveAccount(): AccountState | undefined;

  /**
   * Accounts that have logged in
   */
  getAccounts(): AccountState[];

  /**
   * Is login access key available
   */
  isLoginAccessKeyAvailable(options?: IsLoginAccessKeyAvailableOptions): Promise<boolean>;

  /**
   * Send multiple transactions and return success value of last transaction
   */
  send<Value>(mTransaction: MultiTransaction, options?: MultiSendWalletSelectorSendOptions<Value>): Promise<Value>;

  /**
   * Send multiple transactions and return outcomes
   */
  sendRaw(
    mTransaction: MultiTransaction,
    options?: MultiSendWalletSelectorSendRawOptions,
  ): Promise<FinalExecutionOutcome[]>;

  /**
   * Call a contract method and return success value
   */
  call<Value, Args = EmptyArgs>(options: MultiSendWalletSelectorCallOptions<Value, Args>): Promise<Value>;

  /**
   * Call a contract method and return outcome
   */
  callRaw<Args = EmptyArgs>(options: MultiSendWalletSelectorCallRawOptions<Args>): Promise<FinalExecutionOutcome>;

  /**
   * View a contract method and return success value
   */
  view<Value, Args = EmptyArgs>(options: ViewOptions<Value, Args>): Promise<Value>;
}

export type IsLoginAccessKeyAvailableOptions = {
  accountId?: string;
  requiredAllowance?: string;
};

export type MultiSendWalletSelectorCallOptions<Value, Args> = CallOptions<Value, Args> & {
  walletId?: string;
  callbackUrl?: string;
};

export type MultiSendWalletSelectorCallRawOptions<Args> = CallRawOptions<Args> & {
  walletId?: string;
  callbackUrl?: string;
};

export type MultiSendWalletSelectorSendOptions<Value> = SendOptions<Value> & {
  walletId?: string;
  callbackUrl?: string;
};

export type MultiSendWalletSelectorSendRawOptions = SendRawOptions & {
  walletId?: string;
  callbackUrl?: string;
};

export type MultiSendWalletSelectorOptions = WalletSelectorParams | { selector: WalletSelector };

export type WalletSelectorTransaction = {
  signerId?: string;
  receiverId: string;
  actions: NearWalletSelectorAction[];
};
