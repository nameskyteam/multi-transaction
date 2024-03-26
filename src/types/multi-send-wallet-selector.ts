import { AccountState, WalletSelector } from '@near-wallet-selector/core';
import { Near } from 'near-api-js';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { Call, CallOptions, CallRawOptions, Send, SendOptions, SendRawOptions, View, ViewOptions } from './send';
import { MultiTransaction } from '../core';
import { WalletSelectorParams } from '@near-wallet-selector/core/src/lib/wallet-selector.types';
import { EmptyArgs } from './common';

export interface MultiSendWalletSelector extends WalletSelector, WalletSelectorExtension {}

interface WalletSelectorExtension extends View, Call, Send {
  near: Near;

  /**
   * Account that is login
   */
  getActiveAccountId(): string | undefined;

  /**
   * Account that is login
   */
  getActiveAccount(): AccountState | undefined;

  /**
   * Accounts that have logged in
   */
  getAccountIds(): string[];

  /**
   * Accounts that have logged in
   */
  getAccounts(): AccountState[];

  /**
   * Is login access key active
   */
  isLoginAccessKeyActive(options: IsLoginAccessKeyActiveOptions): Promise<boolean>;

  /**
   * View a contract method and return success value
   */
  view<Value, Args = EmptyArgs>(options: ViewOptions<Value, Args>): Promise<Value>;

  /**
   * Call a contract method and return success value
   */
  call<Value, Args = EmptyArgs>(options: MultiSendWalletSelectorCallOptions<Value, Args>): Promise<Value>;

  /**
   * Call a contract method and return outcome
   */
  callRaw<Args = EmptyArgs>(options: MultiSendWalletSelectorCallRawOptions<Args>): Promise<FinalExecutionOutcome>;

  /**
   * Send multiple transactions and return success value of last transaction
   */
  send<Value>(mtx: MultiTransaction, options?: MultiSendWalletSelectorSendOptions<Value>): Promise<Value>;

  /**
   * Send multiple transactions and return outcomes
   */
  sendRaw(mtx: MultiTransaction, options?: MultiSendWalletSelectorSendRawOptions): Promise<FinalExecutionOutcome[]>;
}

export type IsLoginAccessKeyActiveOptions = {
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

export type MultiSendWalletSelectorOptions = WalletSelectorParams | WalletSelector;
