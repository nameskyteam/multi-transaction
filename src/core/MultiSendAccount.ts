import { Account } from 'near-api-js';
import {
  FunctionViewOptions,
  MultiSendAccountSendOptions
} from '../types';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { SignAndSendTransactionsOptions } from '../types';
import { SignAndSendTransactionOptions } from 'near-api-js/lib/account';
import {parseOutcomeValue, getReceiptErrors, throwReceiptErrorsIfAny} from "../utils";
import {MultiTransaction} from "./MultiTransaction";
import {bytesOrJsonStringify, jsonParse} from "../utils/serialization";

/**
 * Enhancement of `Account` based on `MultiTransaction`
 */
export class MultiSendAccount extends Account {
  // rewrite to make method public
  async signAndSendTransaction(options: SignAndSendTransactionOptions): Promise<FinalExecutionOutcome> {
    return super.signAndSendTransaction(options);
  }

  async signAndSendTransactions(options: SignAndSendTransactionsOptions): Promise<FinalExecutionOutcome[]> {
    const outcomes: FinalExecutionOutcome[] = [];
    for (const transaction of options.transactions) {
      const outcome = await this.signAndSendTransaction(transaction);
      outcomes.push(outcome);
    }
    return outcomes;
  }

  async view<Value, Args>({
    contractId,
    methodName,
    args,
    blockQuery,
    stringify = bytesOrJsonStringify,
    parse = jsonParse,
  }: FunctionViewOptions<Value, Args>): Promise<Value> {
    return this.viewFunctionV2({
      contractId,
      methodName,
      args: args ?? new Uint8Array(),
      blockQuery,
      stringify: (args: Args) => Buffer.from(stringify(args)),
      parse,
    });
  }

  async send<Value>(transaction: MultiTransaction, options?: MultiSendAccountSendOptions<Value>): Promise<Value | undefined> {
    const outcomes = await this.signAndSendTransactions({
      transactions: transaction.toNearApiJsTransactions(),
    });
    if (options?.throwReceiptErrorsIfAny) {
      throwReceiptErrorsIfAny(getReceiptErrors(...outcomes))
    }
    return parseOutcomeValue<Value>(outcomes.pop()!, options?.parse);
  }
}
