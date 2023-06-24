import { Account, Connection } from 'near-api-js';
import { ViewFunctionOptions, ValueParser, EmptyObject } from '../types';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import {
  NearApiJsTransactionLike,
  parseNearApiJsTransactions,
  parseOutcomeValue,
  stringifyJson,
  throwReceiptErrorsIfAny,
} from '../utils';
import { stringifyOrSkip, parseJson } from '../utils';
import { Action } from 'near-api-js/lib/transaction';
import { MultiTransaction } from './MultiTransaction';

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
   * @param options.args `Uint8Array` or serializable types. Default `{}`
   * @param options.stringify Serialize args into bytes if args type is not `Uint8Array`. Default in JSON format.
   * @param options.parse Deserialize returned value from bytes. Default in JSON format.
   * @param options.blockQuery Could view contract method in the past block
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
   * @param transaction Multiple transaction
   * @param options Send options
   * @param options.throwReceiptErrorsIfAny If receipts in outcomes have any error, throw them.
   * @param options.parse Deserialize returned value from bytes. Default in JSON format.
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
