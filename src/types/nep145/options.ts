import { StorageDepositArgs, StorageUnregisterArgs, StorageWithdrawArgs } from './args';
import { ArgsOptions, AttachedDepositOptions, GasOptions } from '../options';

export interface StorageDepositOptions
  extends ArgsOptions<StorageDepositArgs>,
    Required<AttachedDepositOptions>,
    GasOptions {}

export interface StorageWithdrawOptions extends ArgsOptions<StorageWithdrawArgs>, GasOptions {}

export interface StorageUnregisterOptions extends ArgsOptions<StorageUnregisterArgs>, GasOptions {}
