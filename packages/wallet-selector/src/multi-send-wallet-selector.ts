import {
  setupWalletSelector,
  WalletSelector,
  WalletSelectorParams,
} from '@near-wallet-selector/core';
import { FinalExecutionOutcome } from '@near-js/types';
import { PublicKey } from '@near-js/crypto';
import { Near } from '@near-js/wallet-account';
import {
  MultiTransaction,
  Amount,
  BlockQuery,
  Stringifier,
  Parser,
  SendTransactionError,
  BigNumber,
  parseOutcomeValue,
  throwReceiptErrorsFromOutcomes,
} from '@multi-transaction/core';
import { MultiSendWalletSelector } from './MultiSendWalletSelector';
import { parseWalletSelectorTransactions } from './utils';

let MULTI_SEND_WALLET_SELECTOR: MultiSendWalletSelector | undefined;

export async function setupMultiSendWalletSelector(
  options: MultiSendWalletSelectorOptions,
): Promise<MultiSendWalletSelector> {
  let allowMultipleSelectors: boolean | undefined;
  let selector: WalletSelector;

  if ('selector' in options) {
    selector = options.selector;
  } else {
    selector = await setupWalletSelector(options);
    allowMultipleSelectors = options.allowMultipleSelectors;
  }

  if (allowMultipleSelectors) {
    return createMultiSendWalletSelector(selector);
  }

  if (!MULTI_SEND_WALLET_SELECTOR) {
    MULTI_SEND_WALLET_SELECTOR = createMultiSendWalletSelector(selector);
  }

  return MULTI_SEND_WALLET_SELECTOR;
}

function createMultiSendWalletSelector(
  selector: WalletSelector,
): MultiSendWalletSelector {
  const near = new Near(selector.options.network);

  return {
    ...selector,

    getActiveAccount() {
      return this.store
        .getState()
        .accounts.find((accountState) => accountState.active);
    },

    getAccounts() {
      return this.store.getState().accounts;
    },

    async isLoginAccessKeyAvailable(options = {}) {
      const {
        accountId = this.getActiveAccount()?.accountId,
        requiredAllowance = Amount.parse('0.01', 'NEAR'),
      } = options;

      if (!accountId) {
        return false;
      }

      const accountStates = this.getAccounts();
      const accountState = accountStates.find(
        (accountState) => accountState.accountId === accountId,
      );

      const publicKey = accountState?.publicKey;

      if (!publicKey) {
        return false;
      }

      const account = await near.account(accountId);
      const accessKeys = await account.getAccessKeys();
      const accessKey = accessKeys.find((accessKey) => {
        const remotePublicKey = PublicKey.fromString(accessKey.public_key);
        const localPublicKey = PublicKey.fromString(publicKey);
        return remotePublicKey.toString() === localPublicKey.toString();
      });

      if (!accessKey) {
        return false;
      }

      if (accessKey.access_key.permission === 'FullAccess') {
        return true;
      }

      const allowance = accessKey.access_key.permission.FunctionCall.allowance;

      if (!allowance) {
        return true;
      }

      const remainingAllowance = BigNumber(allowance);
      return remainingAllowance.gte(requiredAllowance);
    },

    async send(mTransaction, options = {}) {
      const { parser, ...sendRawOptions } = options;
      const outcomes = await this.sendRaw(mTransaction, sendRawOptions);
      const outcome = outcomes?.[outcomes.length - 1];
      return parseOutcomeValue(outcome, parser);
    },

    async sendRaw(mTransaction, options = {}) {
      const { throwReceiptErrors, walletId, callbackUrl } = options;

      const transactions = parseWalletSelectorTransactions(mTransaction);

      if (transactions.length === 0) {
        throw new SendTransactionError('Transaction not found.');
      }

      const wallet = await this.wallet(walletId);

      let outcomes: FinalExecutionOutcome[] | undefined;

      if (transactions.length === 1) {
        const outcome = await wallet.signAndSendTransaction({
          ...transactions[0],
          callbackUrl,
        });
        if (outcome) {
          outcomes = [outcome];
        }
      } else {
        const res = await wallet.signAndSendTransactions({
          transactions,
          callbackUrl,
        });
        if (res) {
          outcomes = res;
        }
      }

      while (!outcomes) {
        // browser wallet, wait for direction
      }

      if (throwReceiptErrors) {
        throwReceiptErrorsFromOutcomes(outcomes);
      }

      return outcomes;
    },

    async call(options) {
      const { parser, ...callRawOptions } = options;
      const outcome = await this.callRaw(callRawOptions);
      return parseOutcomeValue(outcome, parser);
    },

    async callRaw(options) {
      const {
        contractId,
        methodName,
        args,
        attachedDeposit,
        gas,
        stringifier,
        ...sendRawOptions
      } = options;

      const mTransaction = MultiTransaction.batch(contractId).functionCall({
        methodName,
        args,
        attachedDeposit,
        gas,
        stringifier,
      });

      const outcomes = await this.sendRaw(mTransaction, sendRawOptions);

      return outcomes?.[0];
    },

    async view(options) {
      const {
        contractId,
        methodName,
        args,
        stringifier = Stringifier.json(),
        parser = Parser.json(),
        blockQuery = BlockQuery.OPTIMISTIC,
      } = options;

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
  };
}

export type MultiSendWalletSelectorOptions =
  | WalletSelectorParams
  | { selector: WalletSelector };
