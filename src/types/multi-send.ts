import { MultiTransaction } from '../core';
import { ViewFunctionOptions } from './options';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';

export interface View {
  view<Value, Args>(options: ViewFunctionOptions<Value, Args>): Promise<Value>;
}

export interface MultiSend {
  send<Value>(mTx: MultiTransaction): Promise<Value | undefined>;
  sendRaw(mTx: MultiTransaction): Promise<FinalExecutionOutcome[] | undefined>;
}
