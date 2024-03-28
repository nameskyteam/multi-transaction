import { AccountState, WalletSelector } from '@near-wallet-selector/core';
import { Near } from 'near-api-js';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { View, ViewOptions } from './view';
import { Call, CallOptions, CallRawOptions } from './call';
import { Send, SendOptions, SendRawOptions } from './send';
import { MultiTransaction } from '../core';
import { WalletSelectorParams } from '@near-wallet-selector/core/src/lib/wallet-selector.types';
import { EmptyArgs } from './function-call';

export interface MultiSendWalletSelector extends WalletSelector, WalletSelectorExtension {}

interface WalletSelectorExtension extends View, Call, Send {
  near: Near;

  /**
   * Account that is login
   */
  getActiveAccount(): AccountState | undefined;

  /**
   * Accounts that have logged in
   */
  getAccounts(): AccountState[];

  /**
   * Is login access key active
   */
  isLoginAccessKeyActive(options?: IsLoginAccessKeyActiveOptions): Promise<boolean>;

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
  send<Value>(mTransaction: MultiTransaction, options?: MultiSendWalletSelectorSendOptions<Value>): Promise<Value>;

  /**
   * Send multiple transactions and return outcomes
   */
  sendRaw(
    mTransaction: MultiTransaction,
    options?: MultiSendWalletSelectorSendRawOptions,
  ): Promise<FinalExecutionOutcome[]>;
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
