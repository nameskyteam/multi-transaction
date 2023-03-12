import { Network, NetworkId, setupWalletSelector } from '@near-wallet-selector/core';
import { keyStores, Near } from 'near-api-js';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { PublicKey } from 'near-api-js/lib/utils';
import { MultiSendWalletSelector } from '../types';
import { MultiSendWalletSelectorConfig } from '../types';
import { MultiSendAccount } from './MultiSendAccount';
import { MultiSendWalletSelectorSendOptions, ViewFunctionOptions } from '../types';
import { MultiTransaction } from './MultiTransaction';
import { Amount, parseOutcomeValue, throwReceiptErrorsIfAny } from '../utils';

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

    const viewer = new MultiSendAccount(near.connection);

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

      async view<Value, Args>(options: ViewFunctionOptions<Value, Args>): Promise<Value> {
        return this.viewer.view<Value, Args>(options);
      },

      async send<Value>(
        transaction: MultiTransaction,
        options?: MultiSendWalletSelectorSendOptions<Value>
      ): Promise<Value | undefined> {
        const wallet = await this.wallet(options?.walletId);
        const transactions = transaction.toNearWalletSelectorTransactions();
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

      async sendWithLocalKey<Value>(signerID: string, transaction: MultiTransaction): Promise<Value> {
        return new MultiSendAccount(this.near.connection, signerID).send<Value>(transaction);
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
