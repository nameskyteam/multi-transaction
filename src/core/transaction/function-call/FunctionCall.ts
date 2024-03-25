import { FunctionCallOptions } from '../MultiTransaction';
import { MultiAction } from '../../../types';

export abstract class FunctionCall<M extends MultiAction> {
  private mTx: M;

  protected constructor(mTx: M) {
    this.mTx = mTx;
  }

  protected functionCall<Args>(options: FunctionCallOptions<Args>): M {
    return this.mTx.functionCall(options);
  }
}
