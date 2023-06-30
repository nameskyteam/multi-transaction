import { Account, Connection } from 'near-api-js';
import { ViewFunctionOptions, Parser, EmptyObject } from '../types';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import {
  NearApiJsTransactionLike,
  parseNearApiJsTransactions,
  parseOutcomeValue,
  stringifyOrSkip,
  throwReceiptErrorsIfAny,
} from '../utils';
import { Action } from 'near-api-js/lib/transaction';
import { MultiTransaction } from './MultiTransaction';
import { parseJson, stringifyJson } from '../serde';

export class MultiSendAccount extends Account {
  constructor(connection: Connection, accountId = '') {
    super(connection, accountId);
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
  async view<Value, Args = EmptyObject>({
    contractId,
    methodName,
    args,
    stringify = stringifyJson,
    parse = parseJson,
    blockQuery,
  }: ViewFunctionOptions<Value, Args>): Promise<Value> {
    return super.viewFunctionV2({
      contractId,
      methodName,
      args: stringifyOrSkip(args ?? ({} as Args), stringify),
      stringify: (args) => args,
      parse,
      blockQuery,
    });
  }

  /**
   * Send multiple transactions and return success value of last transaction
   * @param transaction Multiple transactions
   * @param options Options
   */
  async send<Value>(transaction: MultiTransaction, options?: SendOptions<Value>): Promise<Value> {
    const outcomes = await this.signAndSendTransactions({
      transactions: parseNearApiJsTransactions(transaction),
    });
    if (options?.throwReceiptErrorsIfAny) {
      throwReceiptErrorsIfAny(...outcomes);
    }
    return parseOutcomeValue<Value>(outcomes[outcomes.length - 1], options?.parse);
  }
}

export interface SendOptions<Value> {
  /**
   * If receipts in outcomes have any error, throw them
   */
  throwReceiptErrorsIfAny?: boolean;

  /**
   * Deserialize returned value from bytes. Default in JSON format
   */
  parse?: Parser<Value>;
}

export interface SignAndSendTransactionOptions {
  receiverId: string;
  actions: Action[];
  returnError?: boolean;
}

export interface SignAndSendTransactionsOptions {
  transactions: NearApiJsTransactionLike[];
}
