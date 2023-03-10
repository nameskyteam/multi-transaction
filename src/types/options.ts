import { BlockReference } from 'near-api-js/lib/providers/provider';
import {NearApiJsTransactionLike} from "./transform";

export interface FunctionCallOptions<Args> {
  methodName: string;
  args?: Args;
  attachedDeposit?: string;
  gas?: string;
  stringify?: ArgsStringifier<Args>;
}

export interface FunctionViewOptions<Value, Args> {
  methodName: string;
  args?: Args;
  contractId: string;
  blockQuery?: BlockQuery;
  stringify?: ArgsStringifier<Args>;
  parse?: ValueParser<Value>;
}

export type ArgsStringifier<Args> = (args: Args) => Uint8Array;

export type ValueParser<Value> = (response: Uint8Array) => Value;

export type BlockQuery = BlockReference;

export type ArgsOptions<Args> = Pick<FunctionCallOptions<Args>, 'args'>;

export type AttachedDepositOptions = Pick<FunctionCallOptions<unknown>, 'attachedDeposit'>;

export type GasOptions = Pick<FunctionCallOptions<unknown>, 'gas'>;

export interface SignAndSendTransactionsOptions {
  transactions: NearApiJsTransactionLike[];
}

export interface MultiSendAccountSendOptions<Value> {
  throwReceiptErrorsIfAny?: boolean;
  parse?: ValueParser<Value>;
}
