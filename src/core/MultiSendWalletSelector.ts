import { Network, NetworkId, setupWalletSelector } from '@near-wallet-selector/core';
import { keyStores, Near } from 'near-api-js';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { PublicKey } from 'near-api-js/lib/utils';
import { MultiSendWalletSelector } from '../types';
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
import { parseJson, stringifyJson, stringifyJsonOrBytes } from '../utils/serialize';
import { SendOptions, SendWithLocalKeyOptions } from '../types/enhancement';

let multiSendWalletSelector: MultiSendWalletSelector | null = null;

export async function setupMultiSendWalletSelector(
  config: MultiSendWalletSelectorConfig
): Promise<MultiSendWalletSelector> {
  if (!multiSendWalletSelector) {
    const selector = await setupWalletSelector({ ...config });

    const keyStore = new keyStores.BrowserLocalStorageKeyStore(localStorage, config.keyStorePrefix);

    const near = new Near({
      ...resolveNetwork(config.network),
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

      async isLoginAccessKeyActive(accountId?: string, minAllowance = Amount.parseYoctoNear('0.01')): Promise<boolean> {
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

        const remainingAllowance = Amount.new(loginAccessKey.access_key.permission.FunctionCall.allowance);
        return remainingAllowance.gte(minAllowance);
      },

      async view<Value, Args>({
        contractId,
        methodName,
        args,
        stringify = stringifyJsonOrBytes,
        parse = parseJson,
        blockQuery,
      }: ViewFunctionOptions<Value, Args>): Promise<Value> {
        return this.viewer.viewFunctionV2({
          contractId,
          methodName,
          args: args ?? stringifyJson({}), // Don't use `new Uint8Array()` by default because contract method may have optional args, it will still do JSON deserialization by `near_sdk`.
          stringify,
          parse,
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
        signerID: string,
        multiTransaction: MultiTransaction,
        options?: SendWithLocalKeyOptions<Value>
      ): Promise<Value> {
        const account = await this.near.account(signerID);
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

export const getNetworkPreset = (networkId: NetworkId): Network => {
  switch (networkId) {
    case 'mainnet':
      return {
        networkId,
        nodeUrl: 'https://rpc.mainnet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        explorerUrl: 'https://explorer.near.org',
        indexerUrl: 'https://api.kitwallet.app',
      };
    case 'testnet':
      return {
        networkId,
        nodeUrl: 'https://rpc.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        explorerUrl: 'https://explorer.testnet.near.org',
        indexerUrl: 'https://testnet-api.kitwallet.app',
      };
    default:
      throw Error(`Failed to find config for: '${networkId}'`);
  }
};

export const resolveNetwork = (network: NetworkId | Network): Network => {
  return typeof network === 'string' ? getNetworkPreset(network) : network;
};
