import {
  FtTransferArgs,
  FtTransferCallArgs,
  FtTransferCallOptions,
  FtTransferOptions,
  MultiAction,
} from '../../../types';
import { Amount, Gas } from '../../../utils';
import { FunctionCall } from './FunctionCall';

export class FungibleTokenFunctionCall<T extends MultiAction> extends FunctionCall<T> {
  constructor(mTx: T) {
    super(mTx);
  }

  /**
   * Add a FunctionCall Action with method `ft_transfer` following the previous one.
   * @param args args
   * @param gas gas
   */
  transfer({ args, gas }: FtTransferOptions): T {
    return this.functionCall<FtTransferArgs>({
      methodName: 'ft_transfer',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }

  /**
   * Add a FunctionCall Action with method `ft_transfer_call` following the previous one.
   * @param args args
   * @param gas gas
   */
  transfer_call({ args, gas }: FtTransferCallOptions): T {
    return this.functionCall<FtTransferCallArgs>({
      methodName: 'ft_transfer_call',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas: gas ?? Gas.parse(50, 'T'),
    });
  }
}
