import { Account, Connection } from 'near-api-js';
import { ViewFunctionOptions, ValueParser, EmptyObject } from '../types';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import {
  NearApiJsTransactionLike,
  parseNearApiJsTransactions,
  parseOutcomeValue,
  throwReceiptErrorsIfAny,
} from '../utils';
import { MultiTransaction } from './MultiTransaction';
import { stringifyJsonOrBytes, parseJson } from '../utils/serialize';
import { Action } from 'near-api-js/lib/transaction';

/**
 * Account that support {@link `MultiTransaction`}
 */
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
   * @param options View options
   * @param options.contractId Contract id
   * @param options.methodName Method name
   * @param options.args `Uint8Array` or other type args, default `{}`
   * @param options.stringify Serialize args to bytes. Default will skip `Uint8Array` or serialize other type args in JSON format
   * @param options.parse Deserialize return value from bytes. Default will deserialize return value in JSON format
   * @param options.blockQuery Could view contract method in the past block
   */
  async view<Value, Args = EmptyObject>({
    contractId,
    methodName,
    args,
    stringify = stringifyJsonOrBytes,
    parse = parseJson,
    blockQuery,
  }: ViewFunctionOptions<Value, Args>): Promise<Value> {
    return super.viewFunctionV2({
      contractId,
      methodName,
      args: args ?? {},
      stringify,
      parse,
      blockQuery,
    });
  }

  /**
   * Send multiple transactions and return success value of last transaction
   * @param transaction Multiple transaction
   * @param options Send options
   * @param options.throwReceiptErrorsIfAny If receipts in outcomes have any error, throw them.
   * @param options.parse Deserialize return value from bytes. Default will deserialize return value in JSON format
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

interface SignAndSendTransactionOptions {
  receiverId: string;
  actions: Action[];
  returnError?: boolean;
}

interface SignAndSendTransactionsOptions {
  transactions: NearApiJsTransactionLike[];
}

interface SendOptions<Value> {
  throwReceiptErrorsIfAny?: boolean;
  parse?: ValueParser<Value>;
}
