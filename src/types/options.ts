import { BlockReference } from 'near-api-js/lib/providers/provider';
import { Buffer } from 'buffer';

export interface FunctionCallOptions<Args> {
  methodName: string;
  args?: Args | Uint8Array;
  attachedDeposit?: string;
  gas?: string;
  stringify?: Stringifier<Args>;
}

export interface ViewFunctionOptions<Value, Args> {
  contractId: string;
  methodName: string;
  args?: Args | Uint8Array;
  stringify?: Stringifier<Args>;
  parse?: Parser<Value>;
  blockQuery?: BlockQuery;
}

export type ArgsOptions<Args> = Pick<FunctionCallOptions<Args>, 'args'>;
export type AttachedDepositOptions = Pick<FunctionCallOptions<unknown>, 'attachedDeposit'>;
export type GasOptions = Pick<FunctionCallOptions<unknown>, 'gas'>;

export type BlockQuery = BlockReference;

export type EmptyObject = Record<string, never>;

export type Stringifier<T> = (data: T) => Buffer;
export type Parser<T> = (data: Uint8Array) => T;
