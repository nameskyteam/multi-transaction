import { NftTransferArgs, NftTransferCallArgs, NftApproveArgs, NftRevokeArgs, NftRevokeAllArgs } from '~/types/nep171';
import { AttachedDepositOptions, GasOptions, ArgsOptions } from '~/types/options';

export interface NftTransferOptions extends Required<ArgsOptions<NftTransferArgs>>, GasOptions {}

export interface NftTransferCallOptions extends Required<ArgsOptions<NftTransferCallArgs>>, GasOptions {}

export interface NftApproveOptions extends Required<ArgsOptions<NftApproveArgs>>, AttachedDepositOptions, GasOptions {}

export interface NftRevokeOptions extends Required<ArgsOptions<NftRevokeArgs>>, GasOptions {}

export interface NftRevokeAllOptions extends Required<ArgsOptions<NftRevokeAllArgs>>, GasOptions {}
