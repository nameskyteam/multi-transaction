import { FtTransferArgs, FtTransferCallArgs } from './args';
import { GasOptions, ArgsOptions } from '../options';

export interface FtTransferOptions extends Required<ArgsOptions<FtTransferArgs>>, GasOptions {}

export interface FtTransferCallOptions extends Required<ArgsOptions<FtTransferCallArgs>>, GasOptions {}
