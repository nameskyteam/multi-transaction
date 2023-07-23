import { MultiTransaction } from '../core';
import { ViewOptions } from './options';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';

export interface View {
  view<Value, Args>(options: ViewOptions<Value, Args>): Promise<Value>;
}

export interface MultiSend {
  send<Value>(mTx: MultiTransaction): Promise<Value | void>;
  sendRaw(mTx: MultiTransaction): Promise<FinalExecutionOutcome[] | void>;
}
