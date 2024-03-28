import { Account, Connection } from 'near-api-js';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import {
  EmptyArgs,
  View,
  ViewOptions,
  Call,
  CallOptions,
  CallRawOptions,
  Send,
  SendOptions,
  SendRawOptions,
} from '../types';
import {
  Stringifier,
  Parser,
  BlockQuery,
  parseNearApiJsTransactions,
  throwReceiptErrorsFromOutcomes,
  parseOutcome,
} from '../utils';
import { MultiTransaction } from './MultiTransaction';
import { SendTransactionError } from '../errors';

export class MultiSendAccount extends Account implements View, Call, Send {
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
   * View a contract method and return success value
   */
  async view<Value, Args = EmptyArgs>({
    contractId,
    methodName,
    args,
    stringifier = Stringifier.json(),
    parser = Parser.json(),
    blockQuery = BlockQuery.OPTIMISTIC,
  }: ViewOptions<Value, Args>): Promise<Value> {
    return this.viewFunction({
      contractId,
      methodName,
      args: args as object,
      stringify: (args) => stringifier.stringifyOrSkip(args),
      parse: (buffer) => parser.parse(buffer),
      blockQuery: blockQuery.toReference(),
    });
  }

  /**
   * Call a contract method and return success value
   */
  async call<Value, Args = EmptyArgs>(options: MultiSendAccountCallOptions<Value, Args>): Promise<Value> {
    const outcome = await this.callRaw(options);
    return parseOutcome(outcome, options.parser);
  }

  /**
   * Call a contract method and return outcome
   */
  async callRaw<Args = EmptyArgs>({
    contractId,
    methodName,
    args,
    attachedDeposit,
    gas,
    stringifier,
    ...options
  }: MultiSendAccountCallRawOptions<Args>): Promise<FinalExecutionOutcome> {
    const mTransaction = MultiTransaction.batch(contractId).functionCall({
      methodName,
      args,
      attachedDeposit,
      gas,
      stringifier,
    });
    const outcomes = await this.sendRaw(mTransaction, options);
    return outcomes[0];
  }

  /**
   * Send multiple transactions and return success value of last transaction
   */
  async send<Value>(mTransaction: MultiTransaction, options?: MultiSendAccountSendOptions<Value>): Promise<Value> {
    const outcomes = await this.sendRaw(mTransaction, options);
    const outcome = outcomes[outcomes.length - 1];
    return parseOutcome(outcome, options?.parser);
  }

  /**
   * Send multiple transactions and return outcomes
   */
  async sendRaw(
    mTransaction: MultiTransaction,
    options?: MultiSendAccountSendRawOptions,
  ): Promise<FinalExecutionOutcome[]> {
    const transactions = parseNearApiJsTransactions(mTransaction);

    if (transactions.length === 0) {
      throw new SendTransactionError('Transaction not found.');
    }

    const outcomes: FinalExecutionOutcome[] = [];

    for (const transaction of transactions) {
      const outcome = await this.signAndSendTransaction({ ...transaction });
      outcomes.push(outcome);
    }

    if (options?.throwReceiptErrors) {
      throwReceiptErrorsFromOutcomes(outcomes);
    }

    return outcomes;
  }
}

export type MultiSendAccountCallOptions<Value, Args> = CallOptions<Value, Args>;

export type MultiSendAccountCallRawOptions<Args> = CallRawOptions<Args>;

export type MultiSendAccountSendOptions<Value> = SendOptions<Value>;

export type MultiSendAccountSendRawOptions = SendRawOptions;
