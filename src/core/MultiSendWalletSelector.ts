import { setupWalletSelector, WalletSelector } from '@near-wallet-selector/core';
import { keyStores, Near } from 'near-api-js';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { PublicKey } from 'near-api-js/lib/utils';
import { EmptyObject, MultiSendWalletSelector } from '../types';
import { MultiSendWalletSelectorConfig } from '../types';
import { ViewFunctionOptions } from '../types';
import { MultiTransaction } from './MultiTransaction';
import {
  Amount,
  parseNearApiJsTransactions,
  parseNearWalletSelectorTransactions,
  parseOutcomeValue,
  throwReceiptErrorsIfAny,
} from '../utils';
import { SendOptions, SendWithLocalKeyOptions } from '../types/enhancement';
import { getParser, stringifyOrSkip } from '../serde';

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

        const remainingAllowance = Amount.from(allowance);
        return remainingAllowance.gte(requiredMinAllowance);
      },

      async view<Value, Args = EmptyObject>({
        contractId,
        methodName,
        args = {} as Args,
        stringify = 'json',
        parse = 'json',
        blockQuery,
      }: ViewFunctionOptions<Value, Args>): Promise<Value> {
        return this.viewer.viewFunction({
          contractId,
          methodName,
          args,
          stringify: (args: Args) => stringifyOrSkip(args, stringify),
          parse: getParser(parse),
          blockQuery,
        });
      },

      async send<Value>(transaction: MultiTransaction, options?: SendOptions<Value>): Promise<Value | undefined> {
        const wallet = await this.wallet(options?.walletId);
        const transactions = parseNearWalletSelectorTransactions(transaction);
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

        if (options?.throwReceiptErrorsIfAny) {
          throwReceiptErrorsIfAny(...outcomes);
        }

        return parseOutcomeValue<Value>(outcomes[outcomes.length - 1], options?.parse);
      },

      async sendWithLocalKey<Value>(
        signerId: string,
        multiTransaction: MultiTransaction,
        options?: SendWithLocalKeyOptions<Value>
      ): Promise<Value> {
        const account = await this.near.account(signerId);
        const outcomes: FinalExecutionOutcome[] = [];
        const transactions = parseNearApiJsTransactions(multiTransaction);

        if (transactions.length === 0) {
          throw Error('Transaction not found.');
        }

        for (const transaction of transactions) {
          const outcome = await account['signAndSendTransaction'](transaction);
          outcomes.push(outcome);
        }

        if (options?.throwReceiptErrorsIfAny) {
          throwReceiptErrorsIfAny(...outcomes);
        }

        return parseOutcomeValue<Value>(outcomes[outcomes.length - 1], options?.parse);
      },
    };
  }

  return multiSendWalletSelector;
}
