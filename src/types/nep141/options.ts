import { FtTransferArgs, FtTransferCallArgs } from '~/types/nep141';
import { GasOptions, ArgsOptions } from '~/types/options';

export interface FtTransferOptions extends Required<ArgsOptions<FtTransferArgs>>, GasOptions {}

export interface FtTransferCallOptions extends Required<ArgsOptions<FtTransferCallArgs>>, GasOptions {}
