import { FtTransferArgs, FtTransferCallArgs, FtTransferCallOptions, FtTransferOptions } from '../../../types';
import { Amount, Gas } from '../../../utils';
import { MultiTransaction } from '../MultiTransaction';
import { FunctionCall } from './FunctionCall';

export class Nep141FunctionCall extends FunctionCall {
  ft_transfer({ args, gas }: FtTransferOptions): MultiTransaction {
    return this.functionCall<FtTransferArgs>({
      methodName: 'ft_transfer',
      args,
      attachedDeposit: Amount.oneYocto(),
      gas,
    });
  }

  ft_transfer_call({ args, gas }: FtTransferCallOptions): MultiTransaction {
    return this.functionCall<FtTransferCallArgs>({
      methodName: 'ft_transfer_call',
      args,
      attachedDeposit: Amount.oneYocto(),
      gas: gas ?? Gas.parse(50, 'tera'),
    });
  }
}
