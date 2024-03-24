import { MultiTransaction, FunctionCallOptions } from '../MultiTransaction';

export abstract class FunctionCall {
  private mTx: MultiTransaction;

  protected constructor(mTx: MultiTransaction) {
    this.mTx = mTx;
  }

  protected functionCall<Args>(options: FunctionCallOptions<Args>): MultiTransaction {
    return this.mTx.functionCall(options);
  }
}
