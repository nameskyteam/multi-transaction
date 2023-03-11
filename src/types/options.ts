import { BlockReference } from 'near-api-js/lib/providers/provider';
import { NearApiJsTransactionLike } from './transform';

export interface FunctionCallOptions<Args> {
  methodName: string;
  args?: Args;
  attachedDeposit?: string;
  gas?: string;
  stringify?: ArgsStringifier<Args>;
}

export interface ViewFunctionOptions<Value, Args> {
  contractId: string;
  methodName: string;
  args?: Args;
  stringify?: ArgsStringifier<Args>;
  parse?: ValueParser<Value>;
  blockQuery?: BlockQuery;
}

export type ArgsStringifier<Args> = (args: Args) => Buffer;

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

export interface MultiSendWalletSelectorSendOptions<Value> {
  walletId?: string;
  callbackUrl?: string;
  throwReceiptErrorsIfAny?: boolean;
  parse?: ValueParser<Value>;
}
