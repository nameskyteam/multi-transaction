import { WalletSelector } from '@near-wallet-selector/core';
import { Account, Near } from 'near-api-js';
import { EmptyArgs, MultiSend, View, ViewFunctionOptions } from '../types';
import { BrowserLocalStorageKeyStore } from 'near-api-js/lib/key_stores';
import { MultiTransaction } from '../core';
import { WalletSelectorParams } from '@near-wallet-selector/core/src/lib/wallet-selector.types';
import { Parse } from '../serde';
import { ParseableFinalExecutionOutcome } from '../utils';
import { Modify } from '@near-wallet-selector/core/src/lib/utils.types';

export type MultiSendWalletSelector = Modify<WalletSelector, WalletSelectorEnhancement>;

interface WalletSelectorEnhancement extends View, MultiSend {
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
  view<Value, Args = EmptyArgs>(options: ViewFunctionOptions<Value, Args>): Promise<Value>;

  /**
   * Send multiple transactions and return success value of last transaction
   * @param mTx Multiple transactions
   * @param options Options
   */
  send<Value>(mTx: MultiTransaction, options?: SendOptions<Value>): Promise<Value | undefined>;

  /**
   * Send multiple transactions
   * @param mTx Multiple transactions
   * @param options Options
   */
  sendRaw(
    mTx: MultiTransaction,
    options?: Omit<SendOptions<unknown>, 'parse'>
  ): Promise<ParseableFinalExecutionOutcome[] | undefined>;

  /**
   * Sign and send multiple transactions with local key in `this.keystore` and return success value of last transaction
   * @param signerId Signer id
   * @param mTx Multiple transactions
   * @param options Options
   */
  sendWithLocalKey<Value>(
    signerId: string,
    mTx: MultiTransaction,
    options?: SendWithLocalKeyOptions<Value>
  ): Promise<Value>;

  /**
   * Sign and send multiple transactions with local key in `this.keystore`
   * @param signerId Signer id
   * @param mTx Multiple transactions
   * @param options Options
   */
  sendWithLocalKeyRaw(
    signerId: string,
    mTx: MultiTransaction,
    options?: Omit<SendWithLocalKeyOptions<unknown>, 'parse'>
  ): Promise<ParseableFinalExecutionOutcome[]>;
}

export interface SendOptions<Value> {
  walletId?: string;
  callbackUrl?: string;
  throwReceiptErrors?: boolean;

  /**
   * Deserialize returned value from bytes
   */
  parse?: Parse<Value>;
}

export interface SendWithLocalKeyOptions<Value> {
  throwReceiptErrors?: boolean;

  /**
   * Deserialize returned value from bytes
   */
  parse?: Parse<Value>;
}

export type MultiSendWalletSelectorConfig = MultiSendWalletSelectorParams | MultiSendWalletSelectorParamsWithSelector;

type MultiSendWalletSelectorParams = WalletSelectorParams & WalletSelectorParamsExtra;

type MultiSendWalletSelectorParamsWithSelector = { selector: WalletSelector } & WalletSelectorParamsExtra;

interface WalletSelectorParamsExtra {
  keyStorePrefix?: string;
}
