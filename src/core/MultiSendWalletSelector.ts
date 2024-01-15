import { setupWalletSelector, WalletSelector } from '@near-wallet-selector/core';
import { keyStores, Near } from 'near-api-js';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { PublicKey } from 'near-api-js/lib/utils';
import {
  EmptyArgs,
  MultiSendWalletSelector,
  MultiSendWalletSelectorCallOptions,
  MultiSendWalletSelectorCallRawOptions,
  MultiSendWalletSelectorSendRawOptions,
  SendOptions,
  SendRawOptions,
} from '../types';
import { MultiSendWalletSelectorConfig } from '../types';
import { ViewOptions } from '../types';
import { MultiTransaction } from './multi-transaction';
import {
  Amount,
  toParseableFinalExecutionOutcomes,
  ParseableFinalExecutionOutcome,
  parseNearApiJsTransactions,
  parseNearWalletSelectorTransactions,
  Parser,
  Stringifier,
  throwReceiptErrorsFromOutcomes,
} from '../utils';
import { MultiSendWalletSelectorSendOptions } from '../types';
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
        requiredMinAllowance = Amount.parse('0.01', 'NEAR')
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
        stringifier = Stringifier.json(),
        parser = Parser.json(),
        blockQuery,
      }: ViewOptions<Value, Args>): Promise<Value> {
        return this.viewer.viewFunction({
          contractId,
          methodName,
          args: args as any,
          stringify: (args) => stringifier.stringifyOrSkip(args),
          parse: (buffer) => parser.parse(buffer),
          blockQuery,
        });
      },

      async call<Value, Args = EmptyArgs>(
        options: MultiSendWalletSelectorCallOptions<Value, Args>
      ): Promise<Value | void> {
        const outcome = await this.callRaw(options);
        return outcome?.parse(options.parser);
      },

      async callRaw<Args = EmptyArgs>({
        contractId,
        methodName,
        args,
        attachedDeposit,
        gas,
        stringifier,
        ...sendOptions
      }: MultiSendWalletSelectorCallRawOptions<Args>): Promise<ParseableFinalExecutionOutcome | void> {
        const mTx = MultiTransaction.batch(contractId).functionCall({
          methodName,
          args,
          attachedDeposit,
          gas,
          stringifier,
        });
        const outcomes = await this.sendRaw(mTx, sendOptions);
        return outcomes?.[0];
      },

      async send<Value>(
        mTx: MultiTransaction,
        options?: MultiSendWalletSelectorSendOptions<Value>
      ): Promise<Value | void> {
        const outcomes = await this.sendRaw(mTx, options);
        const outcome = outcomes?.[outcomes.length - 1];
        return outcome?.parse(options?.parser);
      },

      async sendRaw(
        mTx: MultiTransaction,
        options?: MultiSendWalletSelectorSendRawOptions
      ): Promise<ParseableFinalExecutionOutcome[] | void> {
        const wallet = await this.wallet(options?.walletId);
        const transactions = parseNearWalletSelectorTransactions(mTx);
        let outcomes: FinalExecutionOutcome[] | undefined;

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

        return toParseableFinalExecutionOutcomes(outcomes);
      },

      async sendWithLocalKey<Value>(
        signerId: string,
        mTx: MultiTransaction,
        options?: SendOptions<Value>
      ): Promise<Value> {
        const outcomes = await this.sendRawWithLocalKey(signerId, mTx, options);
        const outcome = outcomes[outcomes.length - 1];
        return outcome.parse(options?.parser);
      },

      async sendRawWithLocalKey(
        signerId: string,
        mTx: MultiTransaction,
        options?: SendRawOptions
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

        return toParseableFinalExecutionOutcomes(outcomes);
      },
    };
  }

  return multiSendWalletSelector;
}
