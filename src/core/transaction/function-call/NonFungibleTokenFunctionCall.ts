import {
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
import { MultiTransaction } from '../MultiTransaction';
import { FunctionCall } from './FunctionCall';

export class NonFungibleTokenFunctionCall extends FunctionCall {
  constructor(mTx: MultiTransaction) {
    super(mTx);
  }

  /**
   * Add a FunctionCall Action with method `nft_transfer` into CURRENT transaction.
   * @param args args
   * @param gas gas
   */
  transfer({ args, gas }: NftTransferOptions): MultiTransaction {
    return this.functionCall<NftTransferArgs>({
      methodName: 'nft_transfer',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }

  /**
   * Add a FunctionCall Action with method `nft_transfer_call` into CURRENT transaction.
   * @param args args
   * @param gas gas
   */
  transfer_call({ args, gas }: NftTransferCallOptions): MultiTransaction {
    return this.functionCall<NftTransferCallArgs>({
      methodName: 'nft_transfer_call',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas: gas ?? Gas.parse(50, 'T'),
    });
  }

  /**
   * Add a FunctionCall Action with method `nft_approve` into CURRENT transaction.
   * @param args args
   * @param attachedDeposit attached deposit
   * @param gas gas
   */
  approve({ args, attachedDeposit, gas }: NftApproveOptions): MultiTransaction {
    return this.functionCall<NftApproveArgs>({
      methodName: 'nft_approve',
      args,
      attachedDeposit: attachedDeposit ?? Amount.parse('0.005', 'NEAR'),
      gas,
    });
  }

  /**
   * Add a FunctionCall Action with method `nft_revoke` into CURRENT transaction.
   * @param args args
   * @param gas gas
   */
  revoke({ args, gas }: NftRevokeOptions): MultiTransaction {
    return this.functionCall<NftRevokeArgs>({
      methodName: 'nft_revoke',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }

  /**
   * Add a FunctionCall Action with method `nft_revoke_all` into CURRENT transaction.
   * @param args args
   * @param gas gas
   */
  revoke_all({ args, gas }: NftRevokeAllOptions): MultiTransaction {
    return this.functionCall<NftRevokeAllArgs>({
      methodName: 'nft_revoke_all',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }
}
