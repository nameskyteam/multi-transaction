import { MultiTransaction } from '../core';
import { ViewFunctionOptions } from './options';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';

export interface MultiSender {
  view<Value, Args>(options: ViewFunctionOptions<Value, Args>): Promise<Value>;
  send<Value>(transaction: MultiTransaction): Promise<Value | undefined>;
  sendRaw(transaction: MultiTransaction): Promise<FinalExecutionOutcome[] | undefined>;
}
