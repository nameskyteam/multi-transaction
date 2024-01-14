import { MultiTransaction } from '../MultiTransaction';
import { FunctionCallOptions } from '../../../types';

export abstract class FunctionCallWrapper {
  private mTx: MultiTransaction;

  constructor(mTx: MultiTransaction) {
    this.mTx = mTx;
  }

  protected functionCall<Args>(options: FunctionCallOptions<Args>): MultiTransaction {
    return this.mTx.functionCall(options);
  }
}
