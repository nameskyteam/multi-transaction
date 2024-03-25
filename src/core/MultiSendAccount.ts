import { Account, Connection } from 'near-api-js';
import {
  Call,
  CallOptions,
  CallRawOptions,
  EmptyArgs,
  Send,
  SendOptions,
  SendRawOptions,
  View,
  ViewOptions,
} from '../types';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import {
  parseNearApiJsTransactions,
  throwReceiptErrorsFromOutcomes,
  Stringifier,
  Parser,
  parseOutcome,
  BlockQuery,
} from '../utils';
import { MultiTransaction } from './transaction';
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
   * View a contract method
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
   * Call a contract method
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
    const mTx = MultiTransaction.batch({ receiverId: contractId }).functionCall({
      methodName,
      args,
      attachedDeposit,
      gas,
      stringifier,
    });
    const outcomes = await this.sendRaw(mTx, options);
    return outcomes[0];
  }

  /**
   * Send multiple transactions and return success value of last transaction
   * @param mTx mTx
   * @param options options
   */
  async send<Value>(mTx: MultiTransaction, options?: MultiSendAccountSendOptions<Value>): Promise<Value> {
    const outcomes = await this.sendRaw(mTx, options);
    const outcome = outcomes[outcomes.length - 1];
    return parseOutcome(outcome, options?.parser);
  }

  /**
   * Send multiple transactions
   * @param mTx mTx
   * @param options options
   */
  async sendRaw(mTx: MultiTransaction, options?: MultiSendAccountSendRawOptions): Promise<FinalExecutionOutcome[]> {
    const transactions = parseNearApiJsTransactions(mTx);

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
