import { Account, Connection } from 'near-api-js';
import { ViewFunctionOptions, MultiSendAccountSendOptions, SignAndSendTransactionOptions } from '../types';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { SignAndSendTransactionsOptions } from '../types';
import { parseOutcomeValue, throwReceiptErrorsIfAny } from '../utils';
import { MultiTransaction } from './MultiTransaction';
import { stringifyJsonOrBytes, parseJson } from '../utils/serialize';

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
   * @param contractId Contract id
   * @param methodName Method name
   * @param args `Uint8Array` or other type args
   * @param stringify Serialize args to bytes. Default will skip `Uint8Array` or serialize other type args in JSON format
   * @param parse Deserialize return value from bytes. Default will deserialize return value in JSON format
   * @param blockQuery Could view contract method in the past block
   */
  async view<Value, Args>({
    contractId,
    methodName,
    args,
    stringify = stringifyJsonOrBytes,
    parse = parseJson,
    blockQuery,
  }: ViewFunctionOptions<Value, Args>): Promise<Value> {
    return this.viewFunctionV2({
      contractId,
      methodName,
      args: args ?? new Uint8Array(),
      blockQuery,
      stringify,
      parse,
    });
  }

  /**
   * Send multiple transactions and return success value of last transaction
   * @param transaction Multiple transaction
   * @param options Send options
   * @param options.throwReceiptErrorsIfAny If receipts in outcomes have any error, throw them. This is useful when
   * outcome is successful but receipts have error accrued. e.g. Standard `ft_transfer_call` will never fail,
   * but `ft_on_transfer` may have panic
   * @param options.parse Deserialize return value from bytes. Default will deserialize return value in JSON format
   */
  async send<Value>(transaction: MultiTransaction, options?: MultiSendAccountSendOptions<Value>): Promise<Value> {
    const outcomes = await this.signAndSendTransactions({
      transactions: transaction.toNearApiJsTransactions(),
    });
    if (options?.throwReceiptErrorsIfAny) {
      throwReceiptErrorsIfAny(...outcomes);
    }
    return parseOutcomeValue<Value>(outcomes[outcomes.length - 1], options?.parse);
  }
}
