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
import { FunctionCallWrapper } from './FunctionCallWrapper';

export class NonFungibleTokenFunctionCallWrapper extends FunctionCallWrapper {
  constructor(mTx: MultiTransaction) {
    super(mTx);
  }

  nft_transfer({ args, gas }: NftTransferOptions): MultiTransaction {
    return this.functionCall<NftTransferArgs>({
      methodName: 'nft_transfer',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }

  nft_transfer_call({ args, gas }: NftTransferCallOptions): MultiTransaction {
    return this.functionCall<NftTransferCallArgs>({
      methodName: 'nft_transfer_call',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas: gas ?? Gas.parse(50, 'T'),
    });
  }

  nft_approve({ args, attachedDeposit, gas }: NftApproveOptions): MultiTransaction {
    return this.functionCall<NftApproveArgs>({
      methodName: 'nft_approve',
      args,
      attachedDeposit: attachedDeposit ?? Amount.parse('0.005', 'NEAR'),
      gas,
    });
  }

  nft_revoke({ args, gas }: NftRevokeOptions): MultiTransaction {
    return this.functionCall<NftRevokeArgs>({
      methodName: 'nft_revoke',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }

  nft_revoke_all({ args, gas }: NftRevokeAllOptions): MultiTransaction {
    return this.functionCall<NftRevokeAllArgs>({
      methodName: 'nft_revoke_all',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }
}
