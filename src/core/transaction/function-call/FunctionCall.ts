import { MultiFunctionCall, FunctionCallOptions } from '../../../types';

export abstract class FunctionCall<T extends MultiFunctionCall> {
  private mTx: T;

  protected constructor(mTx: T) {
    this.mTx = mTx;
  }

  protected functionCall<Args>(options: FunctionCallOptions<Args>): T {
    return this.mTx.functionCall(options);
  }
}
