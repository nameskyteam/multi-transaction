import { Stringifier } from '../utils';

export type FunctionCall<T> = <Args = EmptyArgs>(
  options: FunctionCallOptions<Args>,
) => T;

export type FunctionCallOptions<Args> = {
  methodName: string;
  args?: Args;
  attachedDeposit?: string;
  gas?: string;
  stringifier?: Stringifier<Args>;
};

export type EmptyArgs = Record<string, never>;
