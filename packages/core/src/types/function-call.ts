import { Stringifier } from '../utils';

export type FunctionCall<T> = <Args = JsonArgs>(
  options: FunctionCallOptions<Args>,
) => T;

export type FunctionCallOptions<Args> = {
  methodName: string;
  args?: Args;
  attachedDeposit?: string;
  gas?: string;
  stringifier?: Stringifier<Args>;
};

export type JsonArgs = Record<string, unknown>;
