import { Modify } from '@near-wallet-selector/core/lib/utils.types';
import { WalletSelector } from '@near-wallet-selector/core';
import { Near } from 'near-api-js';
import { MultiSendWalletSelectorSendOptions, ViewFunctionOptions } from './options';
import { BrowserLocalStorageKeyStore } from 'near-api-js/lib/key_stores';
import { MultiTransaction, MultiSendAccount } from '../core';

interface WalletSelectorEnhancement {
  near: Near;
  viewer?: MultiSendAccount;
  getViewer(): MultiSendAccount;
  getActiveAccountId(): string | undefined;
  getAccountIds(): string[];
  keyStore(): BrowserLocalStorageKeyStore;
  multiSendAccount(accountId?: string): MultiSendAccount;
  view<Value, Args>(options: ViewFunctionOptions<Value, Args>): Promise<Value>;
  send<Value>(
    transaction: MultiTransaction,
    options?: MultiSendWalletSelectorSendOptions<Value>
  ): Promise<Value | undefined>;
  sendWithLocalKey<Value>(signerId: string, transaction: MultiTransaction): Promise<Value | undefined>;
  isLoginAccessKeyActive(accountId?: string): Promise<boolean>;
}

export type MultiSendWalletSelector = Modify<WalletSelector, WalletSelectorEnhancement>;
