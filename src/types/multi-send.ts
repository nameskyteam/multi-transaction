import { MultiTransaction } from '../core';
import { CallOptions, CallRawOptions, SendOptions, SendRawOptions, ViewOptions } from './options';
import { ParseableFinalExecutionOutcome } from '../utils';

export interface View {
  view<Value, Args>(options: ViewOptions<Value, Args>): Promise<Value>;
}

export interface Call {
  call<Value, Args>(options: CallOptions<Value, Args>): Promise<Value>;
  callRaw<Args>(options: CallRawOptions<Args>): Promise<ParseableFinalExecutionOutcome>;
}

export interface MultiSend {
  send<Value>(mTx: MultiTransaction, options?: SendOptions<Value>): Promise<Value>;
  sendRaw(mTx: MultiTransaction, options?: SendRawOptions): Promise<ParseableFinalExecutionOutcome[]>;
}
