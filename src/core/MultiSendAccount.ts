import { Account, Connection } from 'near-api-js';
import { EmptyArgs, MultiSend, View, ViewOptions } from '../types';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import {
  getParseableFinalExecutionOutcome,
  getParseableFinalExecutionOutcomes,
  NearApiJsTransactionLike,
  ParseableFinalExecutionOutcome,
  parseNearApiJsTransactions,
  throwReceiptErrorsFromOutcomes,
} from '../utils';
import { Action } from 'near-api-js/lib/transaction';
import { MultiTransaction } from './multi-transaction';
import { getParser, Parse, stringifyOrSkip } from '../serde';

export class MultiSendAccount extends Account implements View, MultiSend {
  constructor(connection: Connection, accountId = '') {
    super(connection, accountId);
  }

  static new(connection: Connection, accountId?: string): MultiSendAccount {
    return new MultiSendAccount(connection, accountId);
  }

  static from(account: Account): MultiSendAccount {
    return new MultiSendAccount(account.connection, account.accountId);
  }

  override async signAndSendTransaction({
    receiverId,
    actions,
    returnError,
  }: SignAndSendTransactionOptions): Promise<ParseableFinalExecutionOutcome> {
    const outcome = await super.signAndSendTransaction({ receiverId, actions, returnError });
    return getParseableFinalExecutionOutcome(outcome);
  }

  async signAndSendTransactions({
    transactions,
    returnError,
  }: SignAndSendTransactionsOptions): Promise<ParseableFinalExecutionOutcome[]> {
    const outcomes: FinalExecutionOutcome[] = [];
    if (transactions.length === 0) {
      throw Error('Transaction not found.');
    }
    for (const transaction of transactions) {
      const outcome = await this.signAndSendTransaction({ ...transaction, returnError });
      outcomes.push(outcome);
    }
    return getParseableFinalExecutionOutcomes(outcomes);
  }

  /**
   * View a contract method
   */
  async view<Value, Args = EmptyArgs>({
    contractId,
    methodName,
    args,
    stringify = 'json',
    parse = 'json',
    blockQuery,
  }: ViewOptions<Value, Args>): Promise<Value> {
    return super.viewFunction({
      contractId,
      methodName,
      args: args as any,
      stringify: (args: Args | Uint8Array) => stringifyOrSkip(args, stringify),
      parse: getParser(parse),
      blockQuery,
    });
  }

  /**
   * Send multiple transactions and return success value of last transaction
   * @param mTx Multiple transactions
   * @param options Options
   */
  async send<Value>(mTx: MultiTransaction, options?: MultiSendAccountSendOptions<Value>): Promise<Value> {
    const outcomes = await this.sendRaw(mTx, options);
    const outcome = outcomes[outcomes.length - 1];
    return outcome.parse(options?.parse ?? 'json');
  }

  /**
   * Send multiple transactions
   * @param mTx Multiple transactions
   * @param options Options
   */
  async sendRaw(
    mTx: MultiTransaction,
    options?: MultiSendAccountSendRawOptions
  ): Promise<ParseableFinalExecutionOutcome[]> {
    const outcomes = await this.signAndSendTransactions({
      transactions: parseNearApiJsTransactions(mTx),
    });

    if (options?.throwReceiptErrors) {
      throwReceiptErrorsFromOutcomes(outcomes);
    }

    return getParseableFinalExecutionOutcomes(outcomes);
  }
}

export interface MultiSendAccountSendOptions<Value> {
  throwReceiptErrors?: boolean;

  /**
   * Deserialize returned value from bytes
   */
  parse?: Parse<Value>;
}

export type MultiSendAccountSendRawOptions = Omit<MultiSendAccountSendOptions<unknown>, 'parse'>;

export interface SignAndSendTransactionOptions {
  receiverId: string;
  actions: Action[];
  returnError?: boolean;
}

export interface SignAndSendTransactionsOptions {
  transactions: NearApiJsTransactionLike[];
  returnError?: boolean;
}
