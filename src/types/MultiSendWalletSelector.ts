import { WalletSelector } from '@near-wallet-selector/core';
import { Near } from 'near-api-js';
import { Call, CallOptions, CallRawOptions, Send, SendOptions, SendRawOptions, View, ViewOptions } from './send';
import { MultiTransaction } from '../core';
import { WalletSelectorParams } from '@near-wallet-selector/core/src/lib/wallet-selector.types';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { EmptyArgs } from './common';

export interface MultiSendWalletSelector extends WalletSelector, WalletSelectorExtension {}

interface WalletSelectorExtension extends View, Call, Send {
  near: Near;

  /**
   * Account that current login
   */
  getActiveAccountId(): string | undefined;

  /**
   * Accounts that have logged in
   */
  getAccountIds(): string[];

  /**
   * Is login access key active
   * If the key is FullAccess, when key exists on chain, it is active
   * If the key is FunctionCall, when key exists on chain and allowance is greater than min allowance, it is active
   * @param accountId account id
   * @param requiredMinAllowance required min allowance
   */
  isLoginAccessKeyActive(accountId?: string, requiredMinAllowance?: string): Promise<boolean>;

  /**
   * View a contract method
   */
  view<Value, Args = EmptyArgs>(options: ViewOptions<Value, Args>): Promise<Value>;

  /**
   * Call a contract method and return success value
   */
  call<Value, Args = EmptyArgs>(options: MultiSendWalletSelectorCallOptions<Value, Args>): Promise<Value>;

  /**
   * Call a contract method
   */
  callRaw<Args = EmptyArgs>(options: MultiSendWalletSelectorCallRawOptions<Args>): Promise<FinalExecutionOutcome>;

  /**
   * Send multiple transactions and return success value of last transaction
   * @param mtx mtx
   * @param options options
   */
  send<Value>(mtx: MultiTransaction, options?: MultiSendWalletSelectorSendOptions<Value>): Promise<Value>;

  /**
   * Send multiple transactions
   * @param mtx mtx
   * @param options options
   */
  sendRaw(mtx: MultiTransaction, options?: MultiSendWalletSelectorSendRawOptions): Promise<FinalExecutionOutcome[]>;
}

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
