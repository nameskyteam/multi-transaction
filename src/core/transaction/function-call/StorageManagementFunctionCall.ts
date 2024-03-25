import {
  MultiAction,
  StorageDepositArgs,
  StorageDepositOptions,
  StorageUnregisterArgs,
  StorageUnregisterOptions,
  StorageWithdrawArgs,
  StorageWithdrawOptions,
} from '../../../types';
import { Amount } from '../../../utils';
import { FunctionCall } from './FunctionCall';

export class StorageManagementFunctionCall<M extends MultiAction> extends FunctionCall<M> {
  constructor(mTx: M) {
    super(mTx);
  }

  /**
   * Add a FunctionCall Action with method `storage_deposit` following the previous one.
   * @param args args
   * @param attachedDeposit attached deposit
   * @param gas gas
   */
  deposit({ args, attachedDeposit, gas }: StorageDepositOptions): M {
    return this.functionCall<StorageDepositArgs>({
      methodName: 'storage_deposit',
      args,
      attachedDeposit,
      gas,
    });
  }

  /**
   * Add a FunctionCall Action with method `storage_withdraw` following the previous one.
   * @param args args
   * @param gas gas
   */
  withdraw({ args, gas }: StorageWithdrawOptions): M {
    return this.functionCall<StorageWithdrawArgs>({
      methodName: 'storage_withdraw',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }

  /**
   * Add a FunctionCall Action with method `storage_unregister` following the previous one.
   * @param args args
   * @param gas gas
   */
  unregister({ args, gas }: StorageUnregisterOptions): M {
    return this.functionCall<StorageUnregisterArgs>({
      methodName: 'storage_unregister',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }
}
