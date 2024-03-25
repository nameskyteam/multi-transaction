import {
  MultiFunctionCall,
  NftApproveArgs,
  NftApproveOptions,
  NftRevokeAllArgs,
  NftRevokeAllOptions,
  NftRevokeArgs,
  NftRevokeOptions,
  NftTransferArgs,
  NftTransferCallArgs,
  NftTransferCallOptions,
  NftTransferOptions,
} from '../../../types';
import { Amount, Gas } from '../../../utils';
import { FunctionCall } from './FunctionCall';

export class NonFungibleTokenFunctionCall<T extends MultiFunctionCall> extends FunctionCall<T> {
  constructor(mTx: T) {
    super(mTx);
  }

  /**
   * Add a FunctionCall Action with method `nft_transfer` following the previous one.
   * @param args args
   * @param gas gas
   */
  transfer({ args, gas }: NftTransferOptions): T {
    return this.functionCall<NftTransferArgs>({
      methodName: 'nft_transfer',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }

  /**
   * Add a FunctionCall Action with method `nft_transfer_call` following the previous one.
   * @param args args
   * @param gas gas
   */
  transfer_call({ args, gas }: NftTransferCallOptions): T {
    return this.functionCall<NftTransferCallArgs>({
      methodName: 'nft_transfer_call',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas: gas ?? Gas.parse(50, 'T'),
    });
  }

  /**
   * Add a FunctionCall Action with method `nft_approve` following the previous one.
   * @param args args
   * @param attachedDeposit attached deposit
   * @param gas gas
   */
  approve({ args, attachedDeposit, gas }: NftApproveOptions): T {
    return this.functionCall<NftApproveArgs>({
      methodName: 'nft_approve',
      args,
      attachedDeposit: attachedDeposit ?? Amount.parse('0.005', 'NEAR'),
      gas,
    });
  }

  /**
   * Add a FunctionCall Action with method `nft_revoke` following the previous one.
   * @param args args
   * @param gas gas
   */
  revoke({ args, gas }: NftRevokeOptions): T {
    return this.functionCall<NftRevokeArgs>({
      methodName: 'nft_revoke',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }

  /**
   * Add a FunctionCall Action with method `nft_revoke_all` following the previous one.
   * @param args args
   * @param gas gas
   */
  revoke_all({ args, gas }: NftRevokeAllOptions): T {
    return this.functionCall<NftRevokeAllArgs>({
      methodName: 'nft_revoke_all',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }
}
