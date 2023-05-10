import { StorageDepositArgs, StorageUnregisterArgs, StorageWithdrawArgs } from '~/types/nep145';
import { ArgsOptions, AttachedDepositOptions, GasOptions } from '~/types/options';

export interface StorageDepositOptions
  extends ArgsOptions<StorageDepositArgs>,
    Required<AttachedDepositOptions>,
    GasOptions {}

export interface StorageWithdrawOptions extends ArgsOptions<StorageWithdrawArgs>, GasOptions {}

export interface StorageUnregisterOptions extends ArgsOptions<StorageUnregisterArgs>, GasOptions {}
