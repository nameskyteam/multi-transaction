import {
  StorageDepositArgs,
  StorageDepositOptions,
  StorageUnregisterArgs,
  StorageUnregisterOptions,
  StorageWithdrawArgs,
  StorageWithdrawOptions,
} from '../../../types';
import { Amount } from '../../../utils';
import { MultiTransaction } from '../MultiTransaction';
import { FunctionCall } from './FunctionCall';

export class Nep145FunctionCall extends FunctionCall {
  storage_deposit({ args, attachedDeposit, gas }: StorageDepositOptions): MultiTransaction {
    return this.functionCall<StorageDepositArgs>({
      methodName: 'storage_deposit',
      args,
      attachedDeposit,
      gas,
    });
  }

  storage_withdraw({ args, gas }: StorageWithdrawOptions): MultiTransaction {
    return this.functionCall<StorageWithdrawArgs>({
      methodName: 'storage_withdraw',
      args,
      attachedDeposit: Amount.oneYocto(),
      gas,
    });
  }

  storage_unregister({ args, gas }: StorageUnregisterOptions): MultiTransaction {
    return this.functionCall<StorageUnregisterArgs>({
      methodName: 'storage_unregister',
      args,
      attachedDeposit: Amount.oneYocto(),
      gas,
    });
  }
}
