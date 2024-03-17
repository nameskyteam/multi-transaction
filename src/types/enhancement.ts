import { WalletSelector } from '@near-wallet-selector/core';
import { Near } from 'near-api-js';
import {
  Call,
  CallOptions,
  CallRawOptions,
  EmptyArgs,
  MultiSend,
  SendOptions,
  SendRawOptions,
  View,
  ViewOptions,
} from '../types';
import { MultiTransaction } from '../core';
import { WalletSelectorParams } from '@near-wallet-selector/core/src/lib/wallet-selector.types';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';

export interface MultiSendWalletSelector extends WalletSelector, WalletSelectorEnhancement {}

export interface WalletSelectorEnhancement extends View, Call, MultiSend {
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
   * @param accountId Account id
   * @param requiredMinAllowance Required min allowance
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
   * @param mTx Multiple transactions
   * @param options Options
   */
  send<Value>(mTx: MultiTransaction, options?: MultiSendWalletSelectorSendOptions<Value>): Promise<Value>;

  /**
   * Send multiple transactions
   * @param mTx Multiple transactions
   * @param options Options
   */
  sendRaw(mTx: MultiTransaction, options?: MultiSendWalletSelectorSendRawOptions): Promise<FinalExecutionOutcome[]>;
}

export interface MultiSendWalletSelectorCallOptions<Value, Args> extends CallOptions<Value, Args> {
  walletId?: string;
  callbackUrl?: string;
}

export interface MultiSendWalletSelectorCallRawOptions<Args> extends CallRawOptions<Args> {
  walletId?: string;
  callbackUrl?: string;
}

export interface MultiSendWalletSelectorSendOptions<Value> extends SendOptions<Value> {
  walletId?: string;
  callbackUrl?: string;
}

export interface MultiSendWalletSelectorSendRawOptions extends SendRawOptions {
  walletId?: string;
  callbackUrl?: string;
}

export type MultiSendWalletSelectorOptions = WalletSelectorParams | WalletSelector;
