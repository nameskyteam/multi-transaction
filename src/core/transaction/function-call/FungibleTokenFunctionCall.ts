import { FtTransferArgs, FtTransferCallArgs, FtTransferCallOptions, FtTransferOptions } from '../../../types';
import { Amount, Gas } from '../../../utils';
import { MultiTransaction } from '../MultiTransaction';
import { FunctionCall } from './FunctionCall';

export class FungibleTokenFunctionCall extends FunctionCall {
  constructor(mTx: MultiTransaction) {
    super(mTx);
  }

  /**
   * Add a FunctionCall Action with method `ft_transfer` following the previous one.
   * @param args args
   * @param gas gas
   */
  transfer({ args, gas }: FtTransferOptions): MultiTransaction {
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
  transfer_call({ args, gas }: FtTransferCallOptions): MultiTransaction {
    return this.functionCall<FtTransferCallArgs>({
      methodName: 'ft_transfer_call',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas: gas ?? Gas.parse(50, 'T'),
    });
  }
}
