import { MultiFunctionCall, FunctionCallOptions } from '../../../types';

export abstract class FunctionCall<T extends MultiFunctionCall> {
  private mtx: T;

  protected constructor(mtx: T) {
    this.mtx = mtx;
  }

  protected functionCall<Args>(options: FunctionCallOptions<Args>): T {
    return this.mtx.functionCall(options);
  }
}
