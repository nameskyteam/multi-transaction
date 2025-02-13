import { Account, Connection } from '@near-js/accounts';
import { FinalExecutionOutcome } from '@near-js/types';
import {
  MultiTransaction,
  EmptyArgs,
  Send,
  SendOptions,
  SendRawOptions,
  Call,
  CallOptions,
  CallRawOptions,
  View,
  ViewOptions,
  Stringifier,
  Parser,
  BlockQuery,
  SendTransactionError,
  parseOutcomeValue,
  throwReceiptErrorsFromOutcomes,
} from '@multi-transaction/core';
import { parseNearApiJsTransactions } from './utils';

export class MultiSendAccount extends Account implements Send, Call, View {
  private constructor(connection: Connection, accountId: string) {
    super(connection, accountId);
  }

  static new(connection: Connection, accountId = ''): MultiSendAccount {
    return new MultiSendAccount(connection, accountId);
  }

  static fromAccount(account: Account): MultiSendAccount {
    return new MultiSendAccount(account.connection, account.accountId);
  }

  /**
   * Send multiple transactions and return success value of last transaction
   */
  async send<Value>(
    mTransaction: MultiTransaction,
    options: MultiSendAccountSendOptions<Value> = {},
  ): Promise<Value> {
    const { parser, ...sendRawOptions } = options;
    const outcomes = await this.sendRaw(mTransaction, sendRawOptions);
    const outcome = outcomes[outcomes.length - 1];
    return parseOutcomeValue(outcome, parser);
  }

  /**
   * Send multiple transactions and return outcomes
   */
  async sendRaw(
    mTransaction: MultiTransaction,
    options: MultiSendAccountSendRawOptions = {},
  ): Promise<FinalExecutionOutcome[]> {
    const { throwReceiptErrors } = options;

    const transactions = parseNearApiJsTransactions(mTransaction);

    if (transactions.length === 0) {
      throw new SendTransactionError('Transaction not found.');
    }

    const outcomes: FinalExecutionOutcome[] = [];

    for (const transaction of transactions) {
      const outcome = await this.signAndSendTransaction({ ...transaction });
      outcomes.push(outcome);
    }

    if (throwReceiptErrors) {
      throwReceiptErrorsFromOutcomes(outcomes);
    }

    return outcomes;
  }

  /**
   * Call a contract method and return success value
   */
  async call<Value, Args = EmptyArgs>(
    options: MultiSendAccountCallOptions<Value, Args>,
  ): Promise<Value> {
    const { parser, ...callRawOptions } = options;
    const outcome = await this.callRaw(callRawOptions);
    return parseOutcomeValue(outcome, parser);
  }

  /**
   * Call a contract method and return outcome
   */
  async callRaw<Args = EmptyArgs>(
    options: MultiSendAccountCallRawOptions<Args>,
  ): Promise<FinalExecutionOutcome> {
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

    return outcomes[0];
  }

  /**
   * View a contract method and return success value
   */
  async view<Value, Args = EmptyArgs>(
    options: ViewOptions<Value, Args>,
  ): Promise<Value> {
    const {
      contractId,
      methodName,
      args,
      stringifier = Stringifier.json(),
      parser = Parser.json(),
      blockQuery = BlockQuery.OPTIMISTIC,
    } = options;

    return this.viewFunction({
      contractId,
      methodName,
      args: args as object,
      stringify: (args) => stringifier.stringifyOrSkip(args),
      parse: (buffer) => parser.parse(buffer),
      blockQuery: blockQuery.toReference(),
    });
  }
}

export type MultiSendAccountCallOptions<Value, Args> = CallOptions<Value, Args>;

export type MultiSendAccountCallRawOptions<Args> = CallRawOptions<Args>;

export type MultiSendAccountSendOptions<Value> = SendOptions<Value>;

export type MultiSendAccountSendRawOptions = SendRawOptions;
