import { BlockQuery, Parser, Stringifier } from '../utils';

export interface View {
  view<Value, Args>(options: ViewOptions<Value, Args>): Promise<Value>;
}

export type ViewOptions<Value, Args> = {
  contractId: string;
  methodName: string;
  args?: Args;
  stringifier?: Stringifier<Args>;
  parser?: Parser<Value>;
  blockQuery?: BlockQuery;
};
