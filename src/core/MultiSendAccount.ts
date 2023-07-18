import { Account, Connection } from 'near-api-js';
import { EmptyArgs, MultiSender, Viewer, ViewFunctionOptions } from '../types';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import {
  buildParseableFinalExecutionOutcome,
  NearApiJsTransactionLike,
  ParseableFinalExecutionOutcome,
  parseNearApiJsTransactions,
  throwReceiptErrorsIfAny,
} from '../utils';
import { Action } from 'near-api-js/lib/transaction';
import { MultiTransaction } from './MultiTransaction';
import { getParser, Parse, stringifyOrSkip } from '../serde';

export class MultiSendAccount extends Account implements Viewer, MultiSender {
  constructor(connection: Connection, accountId = '') {
    super(connection, accountId);
  }

  static from(account: Account) {
    return new MultiSendAccount(account.connection, account.accountId);
  }

  async signAndSendTransaction(options: SignAndSendTransactionOptions): Promise<FinalExecutionOutcome> {
    return super.signAndSendTransaction(options);
  }

  async signAndSendTransactions(options: SignAndSendTransactionsOptions): Promise<FinalExecutionOutcome[]> {
    const outcomes: FinalExecutionOutcome[] = [];
    if (options.transactions.length === 0) {
      throw Error('Transaction not found.');
    }
    for (const transaction of options.transactions) {
      const outcome = await this.signAndSendTransaction(transaction);
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
    stringify = 'json',
    parse = 'json',
    blockQuery,
  }: ViewFunctionOptions<Value, Args>): Promise<Value> {
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
   * @param transaction Multiple transactions
   * @param options Options
   */
  async send<Value>(transaction: MultiTransaction, options?: SendOptions<Value>): Promise<Value> {
    const outcomes = await this.sendRaw(transaction, options);
    const outcome = outcomes[outcomes.length - 1];
    return outcome.parse(options?.parse ?? 'json');
  }

  /**
   * Send multiple transactions
   * @param transaction Multiple transactions
   * @param options Options
   */
  async sendRaw(
    transaction: MultiTransaction,
    options?: Omit<SendOptions<unknown>, 'parse'>
  ): Promise<ParseableFinalExecutionOutcome[]> {
    const outcomes = await this.signAndSendTransactions({
      transactions: parseNearApiJsTransactions(transaction),
    });

    if (options?.throwReceiptErrorsIfAny) {
      throwReceiptErrorsIfAny(...outcomes);
    }

    return outcomes.map((outcome) => buildParseableFinalExecutionOutcome(outcome));
  }
}

export interface SendOptions<Value> {
  throwReceiptErrorsIfAny?: boolean;

  /**
   * Deserialize returned value from bytes
   */
  parse?: Parse<Value>;
}

export interface SignAndSendTransactionOptions {
  receiverId: string;
  actions: Action[];
  returnError?: boolean;
}

export interface SignAndSendTransactionsOptions {
  transactions: NearApiJsTransactionLike[];
}
