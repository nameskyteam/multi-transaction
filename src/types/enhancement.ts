import { WalletSelector } from '@near-wallet-selector/core';
import { Account, Near } from 'near-api-js';
import { Call, CallOptions, Empty, MultiSend, SendOptions, SendRawOptions, View, ViewOptions } from '../types';
import { BrowserLocalStorageKeyStore } from 'near-api-js/lib/key_stores';
import { MultiTransaction } from '../core';
import { WalletSelectorParams } from '@near-wallet-selector/core/src/lib/wallet-selector.types';
import { ParseableFinalExecutionOutcome } from '../utils';
import { Modify } from '@near-wallet-selector/core/src/lib/utils.types';

export type MultiSendWalletSelector = Modify<WalletSelector, WalletSelectorEnhancement>;

interface WalletSelectorEnhancement extends View, Call, MultiSend {
  near: Near;
  keyStore: BrowserLocalStorageKeyStore;
  viewer: Account;

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
  view<Value, Args = Empty>(options: ViewOptions<Value, Args>): Promise<Value>;

  /**
   * Call a contract method and return success value
   */
  call<Value, Args = Empty>(options: MultiSendWalletSelectorCallOptions<Value, Args>): Promise<Value | void>;

  /**
   * Call a contract method
   */
  callRaw<Args = Empty>(
    options: MultiSendWalletSelectorCallRawOptions<Args>
  ): Promise<ParseableFinalExecutionOutcome | void>;

  /**
   * Send multiple transactions and return success value of last transaction
   * @param mTx Multiple transactions
   * @param options Options
   */
  send<Value>(mTx: MultiTransaction, options?: MultiSendWalletSelectorSendOptions<Value>): Promise<Value | void>;

  /**
   * Send multiple transactions
   * @param mTx Multiple transactions
   * @param options Options
   */
  sendRaw(
    mTx: MultiTransaction,
    options?: MultiSendWalletSelectorSendRawOptions
  ): Promise<ParseableFinalExecutionOutcome[] | void>;

  /**
   * Sign and send multiple transactions with local key in `this.keystore` and return success value of last transaction
   * @param signerId Signer id
   * @param mTx Multiple transactions
   * @param options Options
   */
  sendWithLocalKey<Value>(signerId: string, mTx: MultiTransaction, options?: SendOptions<Value>): Promise<Value>;

  /**
   * Sign and send multiple transactions with local key in `this.keystore`
   * @param signerId Signer id
   * @param mTx Multiple transactions
   * @param options Options
   */
  sendRawWithLocalKey(
    signerId: string,
    mTx: MultiTransaction,
    options?: SendRawOptions
  ): Promise<ParseableFinalExecutionOutcome[]>;
}

export interface MultiSendWalletSelectorCallOptions<Value, Args> extends CallOptions<Value, Args> {
  walletId?: string;
  callbackUrl?: string;
}

export type MultiSendWalletSelectorCallRawOptions<Args> = Omit<
  MultiSendWalletSelectorCallOptions<unknown, Args>,
  'parser'
>;

export interface MultiSendWalletSelectorSendOptions<Value> extends SendOptions<Value> {
  walletId?: string;
  callbackUrl?: string;
}

export type MultiSendWalletSelectorSendRawOptions = Omit<MultiSendWalletSelectorSendOptions<unknown>, 'parser'>;

export type MultiSendWalletSelectorConfig = MultiSendWalletSelectorParams | MultiSendWalletSelectorParamsWithSelector;

interface MultiSendWalletSelectorParams extends WalletSelectorParams {
  keyStorePrefix?: string;
}

interface MultiSendWalletSelectorParamsWithSelector {
  keyStorePrefix?: string;
  selector: WalletSelector;
}
