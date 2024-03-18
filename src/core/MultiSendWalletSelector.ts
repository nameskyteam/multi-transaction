import { setupWalletSelector, WalletSelector } from '@near-wallet-selector/core';
import { Near } from 'near-api-js';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { PublicKey } from 'near-api-js/lib/utils';
import {
  EmptyArgs,
  MultiSendWalletSelector,
  MultiSendWalletSelectorCallOptions,
  MultiSendWalletSelectorCallRawOptions,
  MultiSendWalletSelectorSendRawOptions,
} from '../types';
import { MultiSendWalletSelectorOptions } from '../types';
import { ViewOptions } from '../types';
import { MultiTransaction } from './multi-transaction';
import {
  Amount,
  parseNearWalletSelectorTransactions,
  Parser,
  Stringifier,
  throwReceiptErrorsFromOutcomes,
  endless,
  parseOutcomeValue,
} from '../utils';
import { MultiSendWalletSelectorSendOptions } from '../types';
import { BigNumber } from 'bignumber.js';

let multiSendWalletSelector: MultiSendWalletSelector | null = null;

export async function setupMultiSendWalletSelector(
  options: MultiSendWalletSelectorOptions
): Promise<MultiSendWalletSelector> {
  if (!multiSendWalletSelector) {
    let selector: WalletSelector;

    if ('wallet' in options) {
      selector = options;
    } else {
      selector = await setupWalletSelector({ ...options });
    }

    const near = new Near(selector.options.network);

    multiSendWalletSelector = {
      ...selector,
      near,

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
        const viewer = await near.account('');
        return viewer.viewFunction({
          contractId,
          methodName,
          args: args as object,
          stringify: (args) => stringifier.stringifyOrSkip(args),
          parse: (buffer) => parser.parse(buffer),
          blockQuery,
        });
      },

      async call<Value, Args = EmptyArgs>(options: MultiSendWalletSelectorCallOptions<Value, Args>): Promise<Value> {
        const outcome = await this.callRaw(options);
        return parseOutcomeValue(outcome, options.parser);
      },

      async callRaw<Args = EmptyArgs>({
        contractId,
        methodName,
        args,
        attachedDeposit,
        gas,
        stringifier,
        ...sendOptions
      }: MultiSendWalletSelectorCallRawOptions<Args>): Promise<FinalExecutionOutcome> {
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

      async send<Value>(mTx: MultiTransaction, options?: MultiSendWalletSelectorSendOptions<Value>): Promise<Value> {
        const outcomes = await this.sendRaw(mTx, options);
        const outcome = outcomes?.[outcomes.length - 1];
        return parseOutcomeValue(outcome, options?.parser);
      },

      async sendRaw(
        mTx: MultiTransaction,
        options?: MultiSendWalletSelectorSendRawOptions
      ): Promise<FinalExecutionOutcome[]> {
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
          // browser wallet, wait for direction
          endless();
        }

        if (options?.throwReceiptErrors) {
          throwReceiptErrorsFromOutcomes(outcomes);
        }

        return outcomes;
      },
    };
  }

  return multiSendWalletSelector;
}
