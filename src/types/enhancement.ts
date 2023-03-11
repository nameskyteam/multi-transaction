import { Modify } from '@near-wallet-selector/core/lib/utils.types';
import { WalletSelector } from '@near-wallet-selector/core';
import { Near } from 'near-api-js';
import { MultiSendWalletSelectorSendOptions, ViewFunctionOptions } from './options';
import { BrowserLocalStorageKeyStore } from 'near-api-js/lib/key_stores';
import { MultiTransaction, MultiSendAccount } from '../core';

interface WalletSelectorEnhancement {
  near: Near;
  keyStore: BrowserLocalStorageKeyStore;
  viewer: MultiSendAccount;

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
   * New a `MultiSendAccount` object
   * @param accountId Account id
   */
  multiSendAccount(accountId?: string): MultiSendAccount;

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
   * @param options.throwReceiptErrorsIfAny If receipts in outcomes have any error, throw them. This is useful when
   * outcome is successful but receipts have error accrued. e.g. Standard `ft_transfer_call` will never fail,
   * but `ft_on_transfer` may have panic
   * @param options.parse Deserialize return value from bytes. Default will deserialize return value in JSON format
   */
  send<Value>(
    transaction: MultiTransaction,
    options?: MultiSendWalletSelectorSendOptions<Value>
  ): Promise<Value | undefined>;

  /**
   * Sign and send multiple transaction with local key in `this.keystore`.
   * Note: login key may not in `this.keystore` in the following cases
   * 1. Default keystore prefix `near-api-js:keystore:` is not be used.
   * 2. User doesn't use [NearWallet](https://wallet.near.org) or [MyNearWallet](https://mynearwallet.com).
   * @param signerId Signer id
   * @param transaction Multiple transaction
   */
  sendWithLocalKey<Value>(signerId: string, transaction: MultiTransaction): Promise<Value>;
}

/**
 * Wallet selector that support [`MultiTransaction`]()
 */
export type MultiSendWalletSelector = Modify<WalletSelector, WalletSelectorEnhancement>;
