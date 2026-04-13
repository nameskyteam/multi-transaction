import { BlockQuery, Parser, Stringifier } from '../utils';
import { CallContractViewFunctionResultRaw } from '@near-js/types';

export interface View {
  view<Value, Args>(options: ViewOptions<Value, Args>): Promise<Value>;
  viewRaw<Args>(
    options: ViewRawOptions<Args>,
  ): Promise<CallContractViewFunctionResultRaw>;
}

export type ViewOptions<Value, Args> = {
  contractId: string;
  methodName: string;
  args?: Args;
  stringifier?: Stringifier<Args>;
  parser?: Parser<Value>;
  blockQuery?: BlockQuery;
};

export type ViewRawOptions<Args> = {
  contractId: string;
  methodName: string;
  args?: Args;
  stringifier?: Stringifier<Args>;
  blockQuery?: BlockQuery;
};
