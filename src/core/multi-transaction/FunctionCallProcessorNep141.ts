import { FtTransferArgs, FtTransferCallArgs, FtTransferCallOptions, FtTransferOptions } from '../../types';
import { Amount, Gas } from '../../utils';
import { MultiTransaction } from './MultiTransaction';
import { FunctionCallProcessor } from './FunctionCallProcessor';

export class FunctionCallProcessorNep141 extends FunctionCallProcessor {
  ft_transfer({ args, gas }: FtTransferOptions): MultiTransaction {
    return this.functionCall<FtTransferArgs>({
      methodName: 'ft_transfer',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }

  ft_transfer_call({ args, gas }: FtTransferCallOptions): MultiTransaction {
    return this.functionCall<FtTransferCallArgs>({
      methodName: 'ft_transfer_call',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas: gas ?? Gas.tera(50),
    });
  }
}
