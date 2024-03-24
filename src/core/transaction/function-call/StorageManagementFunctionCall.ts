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

export class StorageManagementFunctionCall extends FunctionCall {
  constructor(mTx: MultiTransaction) {
    super(mTx);
  }

  /**
   * Add a FunctionCall action with method `storage_deposit` into CURRENT transaction.
   * @param args args
   * @param attachedDeposit attached deposit
   * @param gas gas
   */
  deposit({ args, attachedDeposit, gas }: StorageDepositOptions): MultiTransaction {
    return this.functionCall<StorageDepositArgs>({
      methodName: 'storage_deposit',
      args,
      attachedDeposit,
      gas,
    });
  }

  /**
   * Add a FunctionCall action with method `storage_withdraw` into CURRENT transaction.
   * @param args args
   * @param gas gas
   */
  withdraw({ args, gas }: StorageWithdrawOptions): MultiTransaction {
    return this.functionCall<StorageWithdrawArgs>({
      methodName: 'storage_withdraw',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }

  /**
   * Add a FunctionCall action with method `storage_unregister` into CURRENT transaction.
   * @param args args
   * @param gas gas
   */
  unregister({ args, gas }: StorageUnregisterOptions): MultiTransaction {
    return this.functionCall<StorageUnregisterArgs>({
      methodName: 'storage_unregister',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }
}
