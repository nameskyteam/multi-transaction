import { Modify } from '@near-wallet-selector/core/lib/utils.types';
import { WalletSelector } from '@near-wallet-selector/core';
import { Account, Near } from 'near-api-js';
import { ValueParser, ViewFunctionOptions } from './options';
import { BrowserLocalStorageKeyStore } from 'near-api-js/lib/key_stores';
import { MultiTransaction } from '../core';

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
   * Is login access key active.
   * If the key is FullAccess, when key exists on chain, it is active.
   * If the key is FunctionCall, when key exists on chain and allowance is greater than min allowance (default 0.01 NEAR), it is active.
   * @param accountId Account id
   * @param minAllowance min allowance
   */
  isLoginAccessKeyActive(accountId?: string, minAllowance?: string): Promise<boolean>;

  /**
   * View a contract method
   * @param options View options
   * @param options.contractId Contract id
   * @param options.methodName Method name
   * @param options.args `Uint8Array` or other type args
   * @param options.stringify Serialize args to bytes. Default will skip `Uint8Array` or serialize other type args in JSON format
   * @param options.parse Deserialize return value from bytes. Default will deserialize return value in JSON format
   * @param options.blockQuery Could view contract method in the past block
   */
  view<Value, Args>(options: ViewFunctionOptions<Value, Args>): Promise<Value>;

  /**
   * Send multiple transactions and return success value of last transaction
   * @param transaction Multiple transaction
   * @param options Send options
   * @param options.walletId Wallet id, e.g. `near-wallet`
   * @param options.callbackUrl Callback when use web wallet
   * @param options.throwReceiptErrorsIfAny If receipts in outcomes have any error, throw them.
   * @param options.parse Deserialize return value from bytes. Default will deserialize return value in JSON format
   */
  send<Value>(transaction: MultiTransaction, options?: SendOptions<Value>): Promise<Value | undefined>;

  /**
   * Sign and send multiple transaction with local key in `this.keystore`.
   * Note: login key may not in `this.keystore` in the following cases
   * 1. Default keystore prefix `near-api-js:keystore:` is not be used.
   * 2. User doesn't use [NearWallet](https://wallet.near.org) or [MyNearWallet](https://mynearwallet.com).
   * @param signerId Signer id
   * @param transaction Multiple transaction
   * @param options Send options
   * @param options.throwReceiptErrorsIfAny If receipts in outcomes have any error, throw them.
   * @param options.parse Deserialize return value from bytes. Default will deserialize return value in JSON format
   */
  sendWithLocalKey<Value>(
    signerId: string,
    transaction: MultiTransaction,
    options?: SendWithLocalKeyOptions<Value>
  ): Promise<Value>;
}

/**
 * Wallet selector that support {@link `MultiTransaction`}
 */
export type MultiSendWalletSelector = Modify<WalletSelector, WalletSelectorEnhancement>;

export interface SendOptions<Value> {
  walletId?: string;
  callbackUrl?: string;
  throwReceiptErrorsIfAny?: boolean;
  parse?: ValueParser<Value>;
}

export interface SendWithLocalKeyOptions<Value> {
  throwReceiptErrorsIfAny?: boolean;
  parse?: ValueParser<Value>;
}
