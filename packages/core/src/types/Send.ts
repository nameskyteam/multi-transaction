import { FinalExecutionOutcome } from '@near-js/types';
import { MultiTransaction } from '../core';
import { Parser } from '../utils';

export interface Send {
  send<Value>(mTransaction: MultiTransaction, options?: SendOptions<Value>): Promise<Value>;
  sendRaw(mTransaction: MultiTransaction, options?: SendRawOptions): Promise<FinalExecutionOutcome[]>;
}

export type SendOptions<Value> = SendRawOptions & {
  parser?: Parser<Value>;
};

export type SendRawOptions = {
  throwReceiptErrors?: boolean;
};
