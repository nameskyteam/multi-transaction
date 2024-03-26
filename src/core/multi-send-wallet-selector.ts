import { setupWalletSelector, WalletSelector } from '@near-wallet-selector/core';
import { Near } from 'near-api-js';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { PublicKey } from 'near-api-js/lib/utils';
import { BigNumber } from 'bignumber.js';
import {
  EmptyArgs,
  MultiSendWalletSelector,
  MultiSendWalletSelectorCallOptions,
  MultiSendWalletSelectorCallRawOptions,
  MultiSendWalletSelectorOptions,
  MultiSendWalletSelectorSendOptions,
  MultiSendWalletSelectorSendRawOptions,
  ViewOptions,
} from '../types';
import { MultiTransaction } from './MultiTransaction';
import {
  Amount,
  BlockQuery,
  Stringifier,
  Parser,
  endless,
  parseNearWalletSelectorTransactions,
  parseOutcome,
  throwReceiptErrorsFromOutcomes,
} from '../utils';
import { SendTransactionError } from '../errors';

let MULTI_SEND_WALLET_SELECTOR: MultiSendWalletSelector | undefined;

export async function setupMultiSendWalletSelector(
  options: MultiSendWalletSelectorOptions,
): Promise<MultiSendWalletSelector> {
  let allowMultipleSelectors: boolean | undefined;
  let selector: WalletSelector;

  if ('wallet' in options) {
    selector = options;
  } else {
    allowMultipleSelectors = options.allowMultipleSelectors;
    selector = await setupWalletSelector(options);
  }

  if (allowMultipleSelectors) {
    return extendWalletSelector(selector);
  }

  if (!MULTI_SEND_WALLET_SELECTOR) {
    MULTI_SEND_WALLET_SELECTOR = await extendWalletSelector(selector);
  }

  return MULTI_SEND_WALLET_SELECTOR;
}

async function extendWalletSelector(selector: WalletSelector): Promise<MultiSendWalletSelector> {
  const near = new Near(selector.options.network);

  return {
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
      requiredMinAllowance = Amount.parse('0.01', 'NEAR'),
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
          PublicKey.fromString(accessKey.public_key).toString() === PublicKey.fromString(loginPublicKey).toString(),
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
      blockQuery = BlockQuery.OPTIMISTIC,
    }: ViewOptions<Value, Args>): Promise<Value> {
      const viewer = await near.account('');
      return viewer.viewFunction({
        contractId,
        methodName,
        args: args as object,
        stringify: (args) => stringifier.stringifyOrSkip(args),
        parse: (buffer) => parser.parse(buffer),
        blockQuery: blockQuery.toReference(),
      });
    },

    async call<Value, Args = EmptyArgs>(options: MultiSendWalletSelectorCallOptions<Value, Args>): Promise<Value> {
      const outcome = await this.callRaw(options);
      return parseOutcome(outcome, options.parser);
    },

    async callRaw<Args = EmptyArgs>({
      contractId,
      methodName,
      args,
      attachedDeposit,
      gas,
      stringifier,
      ...options
    }: MultiSendWalletSelectorCallRawOptions<Args>): Promise<FinalExecutionOutcome> {
      const mtx = MultiTransaction.batch({ receiverId: contractId }).functionCall({
        methodName,
        args,
        attachedDeposit,
        gas,
        stringifier,
      });
      const outcomes = await this.sendRaw(mtx, options);
      return outcomes?.[0];
    },

    async send<Value>(mtx: MultiTransaction, options?: MultiSendWalletSelectorSendOptions<Value>): Promise<Value> {
      const outcomes = await this.sendRaw(mtx, options);
      const outcome = outcomes?.[outcomes.length - 1];
      return parseOutcome(outcome, options?.parser);
    },

    async sendRaw(
      mtx: MultiTransaction,
      options?: MultiSendWalletSelectorSendRawOptions,
    ): Promise<FinalExecutionOutcome[]> {
      const transactions = parseNearWalletSelectorTransactions(mtx);

      if (transactions.length === 0) {
        throw new SendTransactionError('Transaction not found.');
      }

      const wallet = await this.wallet(options?.walletId);

      let outcomes: FinalExecutionOutcome[] | undefined;

      if (transactions.length === 1) {
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
  } as MultiSendWalletSelector;
}
