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
import { FunctionCallWrapper } from './FunctionCallWrapper';

export class StorageManagementFunctionCallWrapper extends FunctionCallWrapper {
  storageDeposit({ args, attachedDeposit, gas }: StorageDepositOptions): MultiTransaction {
    return this.functionCall<StorageDepositArgs>({
      methodName: 'storage_deposit',
      args,
      attachedDeposit,
      gas,
    });
  }

  storageWithdraw({ args, gas }: StorageWithdrawOptions): MultiTransaction {
    return this.functionCall<StorageWithdrawArgs>({
      methodName: 'storage_withdraw',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }

  storageUnregister({ args, gas }: StorageUnregisterOptions): MultiTransaction {
    return this.functionCall<StorageUnregisterArgs>({
      methodName: 'storage_unregister',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }
}
