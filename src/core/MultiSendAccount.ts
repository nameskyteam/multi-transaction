import { Account, Connection } from 'near-api-js';
import {
  Call,
  CallOptions,
  CallRawOptions,
  EmptyArgs,
  MultiSend,
  SendOptions,
  SendRawOptions,
  View,
  ViewOptions,
} from '../types';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import {
  NearApiJsTransactionLike,
  parseNearApiJsTransactions,
  throwReceiptErrorsFromOutcomes,
  Stringifier,
  Parser,
  parseOutcomeValue,
} from '../utils';
import { MultiTransaction } from './multi-transaction';

interface SignAndSendTransactionsOptions {
  transactions: NearApiJsTransactionLike[];
}

export class MultiSendAccount extends Account implements View, Call, MultiSend {
  private constructor(connection: Connection, accountId: string) {
    super(connection, accountId);
  }

  static new(connection: Connection, accountId = ''): MultiSendAccount {
    return new MultiSendAccount(connection, accountId);
  }

  static fromAccount(account: Account): MultiSendAccount {
    return new MultiSendAccount(account.connection, account.accountId);
  }

  private async signAndSendTransactions({
    transactions,
  }: SignAndSendTransactionsOptions): Promise<FinalExecutionOutcome[]> {
    const outcomes: FinalExecutionOutcome[] = [];

    if (transactions.length === 0) {
      throw Error('Transaction not found.');
    }

    for (const transaction of transactions) {
      const outcome = await this.signAndSendTransaction({ ...transaction });
      outcomes.push(outcome);
    }

    return outcomes;
  }

  /**
   * View a contract method
   */
  async view<Value, Args = EmptyArgs>({
    contractId,
    methodName,
    args,
    stringifier = Stringifier.json(),
    parser = Parser.json(),
    blockQuery,
  }: ViewOptions<Value, Args>): Promise<Value> {
    return this.viewFunction({
      contractId,
      methodName,
      args: args as object,
      stringify: (args) => stringifier.stringifyOrSkip(args),
      parse: (buffer) => parser.parse(buffer),
      blockQuery,
    });
  }

  /**
   * Call a contract method and return success value
   */
  async call<Value, Args = EmptyArgs>(options: MultiSendAccountCallOptions<Value, Args>): Promise<Value> {
    const outcome = await this.callRaw(options);
    return parseOutcomeValue(outcome, options.parser);
  }

  /**
   * Call a contract method
   */
  async callRaw<Args = EmptyArgs>({
    contractId,
    methodName,
    args,
    attachedDeposit,
    gas,
    stringifier,
    ...sendOptions
  }: MultiSendAccountCallRawOptions<Args>): Promise<FinalExecutionOutcome> {
    const mTx = MultiTransaction.batch(contractId).functionCall({
      methodName,
      args,
      attachedDeposit,
      gas,
      stringifier,
    });
    const outcomes = await this.sendRaw(mTx, sendOptions);
    return outcomes[0];
  }

  /**
   * Send multiple transactions and return success value of last transaction
   * @param mTx Multiple transactions
   * @param options Options
   */
  async send<Value>(mTx: MultiTransaction, options?: MultiSendAccountSendOptions<Value>): Promise<Value> {
    const outcomes = await this.sendRaw(mTx, options);
    const outcome = outcomes[outcomes.length - 1];
    return parseOutcomeValue(outcome, options?.parser);
  }

  /**
   * Send multiple transactions
   * @param mTx Multiple transactions
   * @param options Options
   */
  async sendRaw(mTx: MultiTransaction, options?: MultiSendAccountSendRawOptions): Promise<FinalExecutionOutcome[]> {
    const outcomes = await this.signAndSendTransactions({
      transactions: parseNearApiJsTransactions(mTx),
    });

    if (options?.throwReceiptErrors) {
      throwReceiptErrorsFromOutcomes(outcomes);
    }

    return outcomes;
  }
}

export interface MultiSendAccountCallOptions<Value, Args> extends CallOptions<Value, Args> {}

export interface MultiSendAccountCallRawOptions<Args> extends CallRawOptions<Args> {}

export interface MultiSendAccountSendOptions<Value> extends SendOptions<Value> {}

export interface MultiSendAccountSendRawOptions extends SendRawOptions {}
