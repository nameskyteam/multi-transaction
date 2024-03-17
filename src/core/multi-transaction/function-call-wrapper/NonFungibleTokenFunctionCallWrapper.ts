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
import snakecaseKeys from 'snakecase-keys';

export class NonFungibleTokenFunctionCallWrapper extends FunctionCallWrapper {
  nftTransfer({ args, gas }: NftTransferOptions): MultiTransaction {
    return this.functionCall<NftTransferArgs>({
      methodName: 'nft_transfer',
      args: snakecaseKeys(args),
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }

  nftTransferCall({ args, gas }: NftTransferCallOptions): MultiTransaction {
    return this.functionCall<NftTransferCallArgs>({
      methodName: 'nft_transfer_call',
      args: snakecaseKeys(args),
      attachedDeposit: Amount.ONE_YOCTO,
      gas: gas ?? Gas.parse(50, 'T'),
    });
  }

  nftApprove({ args, attachedDeposit, gas }: NftApproveOptions): MultiTransaction {
    return this.functionCall<NftApproveArgs>({
      methodName: 'nft_approve',
      args: snakecaseKeys(args),
      attachedDeposit: attachedDeposit ?? Amount.parse('0.005', 'NEAR'),
      gas,
    });
  }

  nftRevoke({ args, gas }: NftRevokeOptions): MultiTransaction {
    return this.functionCall<NftRevokeArgs>({
      methodName: 'nft_revoke',
      args: snakecaseKeys(args),
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }

  nftRevokeAll({ args, gas }: NftRevokeAllOptions): MultiTransaction {
    return this.functionCall<NftRevokeAllArgs>({
      methodName: 'nft_revoke_all',
      args: snakecaseKeys(args),
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }
}