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
  toParseableFinalExecutionOutcomes,
  NearApiJsTransactionLike,
  ParseableFinalExecutionOutcome,
  parseNearApiJsTransactions,
  throwReceiptErrorsFromOutcomes,
  Stringifier,
  Parser,
} from '../utils';
import { MultiTransaction } from './multi-transaction';

interface SignAndSendTransactionsOptions {
  transactions: NearApiJsTransactionLike[];
}

export class MultiSendAccount implements View, Call, MultiSend {
  private readonly account: Account;

  private constructor(account: Account) {
    this.account = account;
  }

  static new(connection: Connection, accountId = ''): MultiSendAccount {
    const account = new Account(connection, accountId);
    return MultiSendAccount.from(account);
  }

  static from(account: Account): MultiSendAccount {
    return new MultiSendAccount(account);
  }

  into(): Account {
    return this.account;
  }

  private async signAndSendTransactions({
    transactions,
  }: SignAndSendTransactionsOptions): Promise<ParseableFinalExecutionOutcome[]> {
    const outcomes: FinalExecutionOutcome[] = [];
    if (transactions.length === 0) {
      throw Error('Transaction not found.');
    }
    for (const transaction of transactions) {
      const outcome = await this.account.signAndSendTransaction({ ...transaction });
      outcomes.push(outcome);
    }
    return toParseableFinalExecutionOutcomes(outcomes);
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
    return this.account.viewFunction({
      contractId,
      methodName,
      args: args as any,
      stringify: (args) => stringifier.stringifyOrSkip(args),
      parse: (buffer) => parser.parse(buffer),
      blockQuery,
    });
  }

  /**
   * Call a contract method and return success value
   */
  async call<Value, Args = EmptyArgs>(options: CallOptions<Value, Args>): Promise<Value> {
    const outcome = await this.callRaw(options);
    return outcome.parse(options.parser);
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
  }: CallRawOptions<Args>): Promise<ParseableFinalExecutionOutcome> {
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
  async send<Value>(mTx: MultiTransaction, options?: SendOptions<Value>): Promise<Value> {
    const outcomes = await this.sendRaw(mTx, options);
    const outcome = outcomes[outcomes.length - 1];
    return outcome.parse(options?.parser);
  }

  /**
   * Send multiple transactions
   * @param mTx Multiple transactions
   * @param options Options
   */
  async sendRaw(mTx: MultiTransaction, options?: SendRawOptions): Promise<ParseableFinalExecutionOutcome[]> {
    const outcomes = await this.signAndSendTransactions({
      transactions: parseNearApiJsTransactions(mTx),
    });

    if (options?.throwReceiptErrors) {
      throwReceiptErrorsFromOutcomes(outcomes);
    }

    return toParseableFinalExecutionOutcomes(outcomes);
  }
}
