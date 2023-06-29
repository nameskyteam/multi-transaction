import { Modify } from '@near-wallet-selector/core/lib/utils.types';
import { WalletSelector } from '@near-wallet-selector/core';
import { Account, Near } from 'near-api-js';
import { EmptyObject, Parser, ViewFunctionOptions } from '../types';
import { BrowserLocalStorageKeyStore } from 'near-api-js/lib/key_stores';
import { MultiTransaction } from '../core';
import { WalletSelectorParams } from '@near-wallet-selector/core/lib/wallet-selector.types';

export type MultiSendWalletSelector = Modify<WalletSelector, WalletSelectorEnhancement>;

interface WalletSelectorEnhancement {
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
   * If the key is FunctionCall, when key exists on chain and allowance is greater than min allowance (default 0.01 NEAR), it is active
   * @param accountId Account id
   * @param requiredMinAllowance Required min allowance
   */
  isLoginAccessKeyActive(accountId?: string, requiredMinAllowance?: string): Promise<boolean>;

  /**
   * View a contract method
   */
  view<Value, Args = EmptyObject>({
    contractId,
    methodName,
    args,
    stringify,
    parse,
    blockQuery,
  }: ViewFunctionOptions<Value, Args>): Promise<Value>;

  /**
   * Send multiple transactions and return success value of last transaction
   * @param transaction Multiple transactions
   * @param options Options
   */
  send<Value>(transaction: MultiTransaction, options?: SendOptions<Value>): Promise<Value | undefined>;

  /**
   * Sign and send multiple transaction with local key in `this.keystore`
   * @param signerId Signer id
   * @param transaction Multiple transactions
   * @param options Options
   */
  sendWithLocalKey<Value>(
    signerId: string,
    transaction: MultiTransaction,
    options?: SendWithLocalKeyOptions<Value>
  ): Promise<Value>;
}

export interface SendOptions<Value> {
  /**
   * Wallet id
   */
  walletId?: string;

  /**
   * Callback URL
   */
  callbackUrl?: string;

  /**
   * If receipts in outcomes have any error, throw them
   */
  throwReceiptErrorsIfAny?: boolean;

  /**
   * Deserialize returned value from bytes. Default in JSON format
   */
  parse?: Parser<Value>;
}

export interface SendWithLocalKeyOptions<Value> {
  /**
   * If receipts in outcomes have any error, throw them
   */
  throwReceiptErrorsIfAny?: boolean;

  /**
   * Deserialize returned value from bytes. Default in JSON format
   */
  parse?: Parser<Value>;
}

export type MultiSendWalletSelectorConfig = MultiSendWalletSelectorParams | MultiSendWalletSelectorParamsWithSelector;

type MultiSendWalletSelectorParams = WalletSelectorParams & WalletSelectorParamsExtra;

type MultiSendWalletSelectorParamsWithSelector = { selector: WalletSelector } & WalletSelectorParamsExtra;

interface WalletSelectorParamsExtra {
  keyStorePrefix?: string;
}
