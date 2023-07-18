import { MultiTransaction } from '../core';
import { ViewFunctionOptions } from './options';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';

export interface Viewer {
  view<Value, Args>(options: ViewFunctionOptions<Value, Args>): Promise<Value>;
}

export interface MultiSender {
  send<Value>(transaction: MultiTransaction): Promise<Value | undefined>;
  sendRaw(transaction: MultiTransaction): Promise<FinalExecutionOutcome[] | undefined>;
}
