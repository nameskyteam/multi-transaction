import { MultiTransaction } from '../core';
import { SendOptions, SendRawOptions, ViewOptions } from './options';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';

export interface View {
  view<Value, Args>(options: ViewOptions<Value, Args>): Promise<Value>;
}

export interface MultiSend {
  send<Value>(mTx: MultiTransaction, options?: SendOptions<Value>): Promise<Value | void>;
  sendRaw(mTx: MultiTransaction, options?: SendRawOptions): Promise<FinalExecutionOutcome[] | void>;
}
