import { MultiTransaction } from '../core';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { BlockQuery, Parser, Stringifier } from '../utils';

export interface View {
  view<Value, Args>(options: ViewOptions<Value, Args>): Promise<Value>;
}

export interface Call {
  call<Value, Args>(options: CallOptions<Value, Args>): Promise<Value>;
  callRaw<Args>(options: CallRawOptions<Args>): Promise<FinalExecutionOutcome>;
}

export interface Send {
  send<Value>(mtx: MultiTransaction, options?: SendOptions<Value>): Promise<Value>;
  sendRaw(mtx: MultiTransaction, options?: SendRawOptions): Promise<FinalExecutionOutcome[]>;
}

export type ViewOptions<Value, Args> = {
  contractId: string;
  methodName: string;
  args?: Args;
  stringifier?: Stringifier<Args>;
  parser?: Parser<Value>;
  blockQuery?: BlockQuery;
};

export type CallOptions<Value, Args> = {
  contractId: string;
  methodName: string;
  args?: Args;
  attachedDeposit?: string;
  gas?: string;
  stringifier?: Stringifier<Args>;
  parser?: Parser<Value>;
  throwReceiptErrors?: boolean;
};

export type CallRawOptions<Args> = {
  contractId: string;
  methodName: string;
  args?: Args;
  attachedDeposit?: string;
  gas?: string;
  stringifier?: Stringifier<Args>;
  throwReceiptErrors?: boolean;
};

export type SendOptions<Value> = {
  throwReceiptErrors?: boolean;
  parser?: Parser<Value>;
};

export type SendRawOptions = {
  throwReceiptErrors?: boolean;
};
