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

export class Nep171FunctionCall extends FunctionCall {
  nft_transfer({ args, gas }: NftTransferOptions): MultiTransaction {
    return this.functionCall<NftTransferArgs>({
      methodName: 'nft_transfer',
      args,
      attachedDeposit: Amount.oneYocto(),
      gas,
    });
  }

  nft_transfer_call({ args, gas }: NftTransferCallOptions): MultiTransaction {
    return this.functionCall<NftTransferCallArgs>({
      methodName: 'nft_transfer_call',
      args,
      attachedDeposit: Amount.oneYocto(),
      gas: gas ?? Gas.parse(50, 'tera'),
    });
  }

  nft_approve({ args, attachedDeposit, gas }: NftApproveOptions): MultiTransaction {
    return this.functionCall<NftApproveArgs>({
      methodName: 'nft_approve',
      args,
      attachedDeposit: attachedDeposit ?? Amount.parse('0.005', 'near'),
      gas,
    });
  }

  nft_revoke({ args, gas }: NftRevokeOptions): MultiTransaction {
    return this.functionCall<NftRevokeArgs>({
      methodName: 'nft_revoke',
      args,
      attachedDeposit: Amount.oneYocto(),
      gas,
    });
  }

  nft_revoke_all({ args, gas }: NftRevokeAllOptions): MultiTransaction {
    return this.functionCall<NftRevokeAllArgs>({
      methodName: 'nft_revoke_all',
      args,
      attachedDeposit: Amount.oneYocto(),
      gas,
    });
  }
}
