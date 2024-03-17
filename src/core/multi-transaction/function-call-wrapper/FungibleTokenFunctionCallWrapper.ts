import { FtTransferArgs, FtTransferCallArgs, FtTransferCallOptions, FtTransferOptions } from '../../../types';
import { Amount, Gas } from '../../../utils';
import { MultiTransaction } from '../MultiTransaction';
import { FunctionCallWrapper } from './FunctionCallWrapper';
import snakecaseKeys from 'snakecase-keys';

export class FungibleTokenFunctionCallWrapper extends FunctionCallWrapper {
  ftTransfer({ args, gas }: FtTransferOptions): MultiTransaction {
    return this.functionCall<FtTransferArgs>({
      methodName: 'ft_transfer',
      args: snakecaseKeys(args),
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }

  ftTransferCall({ args, gas }: FtTransferCallOptions): MultiTransaction {
    return this.functionCall<FtTransferCallArgs>({
      methodName: 'ft_transfer_call',
      args: snakecaseKeys(args),
      attachedDeposit: Amount.ONE_YOCTO,
      gas: gas ?? Gas.parse(50, 'T'),
    });
  }
}
