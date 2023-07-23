import { setupWalletSelector, WalletSelector } from '@near-wallet-selector/core';
import { keyStores, Near } from 'near-api-js';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { PublicKey } from 'near-api-js/lib/utils';
import {
  EmptyArgs,
  MultiSendWalletSelector,
  MultiSendWalletSelectorSendRawOptions,
  MultiSendWalletSelectorSendRawWithLocalKeyOptions,
} from '../types';
import { MultiSendWalletSelectorConfig } from '../types';
import { ViewOptions } from '../types';
import { MultiTransaction } from './multi-transaction';
import {
  Amount,
  getParseableFinalExecutionOutcomes,
  ParseableFinalExecutionOutcome,
  parseNearApiJsTransactions,
  parseNearWalletSelectorTransactions,
  throwReceiptErrorsFromOutcomes,
} from '../utils';
import { MultiSendWalletSelectorSendOptions, MultiSendWalletSelectorSendWithLocalKeyOptions } from '../types';
import { getParser, stringifyOrSkip } from '../serde';
import { BigNumber } from 'bignumber.js';

let multiSendWalletSelector: MultiSendWalletSelector | null = null;

export async function setupMultiSendWalletSelector(
  config: MultiSendWalletSelectorConfig
): Promise<MultiSendWalletSelector> {
  if (!multiSendWalletSelector) {
    let selector: WalletSelector;

    if ('selector' in config) {
      selector = config.selector;
    } else {
      selector = await setupWalletSelector({ ...config });
    }

    const keyStore = new keyStores.BrowserLocalStorageKeyStore(localStorage, config.keyStorePrefix);

    const near = new Near({
      ...selector.options.network,
      keyStore,
    });

    const viewer = await near.account('');

    multiSendWalletSelector = {
      ...selector,
      near,
      keyStore,
      viewer,

      getActiveAccountId(): string | undefined {
        return this.store.getState().accounts.find((accountState) => accountState.active)?.accountId;
      },

      getAccountIds(): string[] {
        return this.store.getState().accounts.map((accountState) => accountState.accountId);
      },

      async isLoginAccessKeyActive(
        accountId?: string,
        requiredMinAllowance = Amount.parseYoctoNear('0.01')
      ): Promise<boolean> {
        accountId = accountId ?? this.getActiveAccountId();
        if (!accountId) {
          return false;
        }

        const loginAccount = await this.wallet()
          .then((wallet) => wallet.getAccounts())
          .then((accounts) => accounts.find((account) => account.accountId === accountId));
        const loginPublicKey = loginAccount?.publicKey;

        if (!loginPublicKey) {
          return false;
        }

        const accessKeys = await this.near.account(accountId).then((account) => account.getAccessKeys());
        const loginAccessKey = accessKeys.find(
          (accessKey) =>
            PublicKey.fromString(accessKey.public_key).toString() === PublicKey.fromString(loginPublicKey).toString()
        );

        if (!loginAccessKey) {
          return false;
        }

        if (loginAccessKey.access_key.permission === 'FullAccess') {
          return true;
        }

        const allowance = loginAccessKey.access_key.permission.FunctionCall.allowance;

        if (!allowance) {
          return true;
        }

        const remainingAllowance = BigNumber(allowance);
        return remainingAllowance.gte(requiredMinAllowance);
      },

      async view<Value, Args = EmptyArgs>({
        contractId,
        methodName,
        args,
        stringify = 'json',
        parse = 'json',
        blockQuery,
      }: ViewOptions<Value, Args>): Promise<Value> {
        return this.viewer.viewFunction({
          contractId,
          methodName,
          args: args as any,
          stringify: (args: Args | Uint8Array) => stringifyOrSkip(args, stringify),
          parse: getParser(parse),
          blockQuery,
        });
      },

      async send<Value>(
        mTx: MultiTransaction,
        options?: MultiSendWalletSelectorSendOptions<Value>
      ): Promise<Value | void> {
        const outcomes = await this.sendRaw(mTx, options);
        if (!outcomes) {
          return;
        }
        const outcome = outcomes[outcomes.length - 1];
        return outcome.parse(options?.parse ?? 'json');
      },

      async sendRaw(
        mTx: MultiTransaction,
        options?: MultiSendWalletSelectorSendRawOptions
      ): Promise<ParseableFinalExecutionOutcome[] | void> {
        const wallet = await this.wallet(options?.walletId);
        const transactions = parseNearWalletSelectorTransactions(mTx);
        let outcomes: FinalExecutionOutcome[] | void;

        if (transactions.length === 0) {
          throw Error(`Transaction not found.`);
        } else if (transactions.length === 1) {
          const outcome = await wallet.signAndSendTransaction({
            ...transactions[0],
            callbackUrl: options?.callbackUrl,
          });
          if (outcome) {
            outcomes = [outcome];
          }
        } else {
          const res = await wallet.signAndSendTransactions({
            transactions,
            callbackUrl: options?.callbackUrl,
          });
          if (res) {
            outcomes = res;
          }
        }

        if (!outcomes) {
          // When use web wallet
          return;
        }

        if (options?.throwReceiptErrors) {
          throwReceiptErrorsFromOutcomes(outcomes);
        }

        return getParseableFinalExecutionOutcomes(outcomes);
      },

      async sendWithLocalKey<Value>(
        signerId: string,
        mTx: MultiTransaction,
        options?: MultiSendWalletSelectorSendWithLocalKeyOptions<Value>
      ): Promise<Value> {
        const outcomes = await this.sendRawWithLocalKey(signerId, mTx, options);
        const outcome = outcomes[outcomes.length - 1];
        return outcome.parse(options?.parse ?? 'json');
      },

      async sendRawWithLocalKey(
        signerId: string,
        mTx: MultiTransaction,
        options?: MultiSendWalletSelectorSendRawWithLocalKeyOptions
      ): Promise<ParseableFinalExecutionOutcome[]> {
        const account = await this.near.account(signerId);
        const outcomes: FinalExecutionOutcome[] = [];
        const transactions = parseNearApiJsTransactions(mTx);

        if (transactions.length === 0) {
          throw Error('Transaction not found.');
        }

        for (const transaction of transactions) {
          const outcome = await account['signAndSendTransaction'](transaction);
          outcomes.push(outcome);
        }

        if (options?.throwReceiptErrors) {
          throwReceiptErrorsFromOutcomes(outcomes);
        }

        return getParseableFinalExecutionOutcomes(outcomes);
      },
    };
  }

  return multiSendWalletSelector;
}
