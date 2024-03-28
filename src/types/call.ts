import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { Parser, Stringifier } from '../utils';

export interface Call {
  call<Value, Args>(options: CallOptions<Value, Args>): Promise<Value>;
  callRaw<Args>(options: CallRawOptions<Args>): Promise<FinalExecutionOutcome>;
}

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
