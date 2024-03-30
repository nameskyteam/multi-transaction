import {CallOptions, CallRawOptions, SendOptions, SendRawOptions} from "@multi-transaction/core";
import { Action as NearApiJsAction } from "@near-js/transactions/lib/actions";

export type MultiSendAccountCallOptions<Value, Args> = CallOptions<Value, Args>;

export type MultiSendAccountCallRawOptions<Args> = CallRawOptions<Args>;

export type MultiSendAccountSendOptions<Value> = SendOptions<Value>;

export type MultiSendAccountSendRawOptions = SendRawOptions;

export type NearApiJsTransaction = {
  receiverId: string;
  actions: NearApiJsAction[];
};
