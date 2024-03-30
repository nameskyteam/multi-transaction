import {
  FunctionCall,
  FungibleTokenFunctionCall,
  NonFungibleTokenFunctionCall,
  StorageManagementFunctionCall,
  FtTransferOptions,
  FtTransferCallOptions,
  NftTransferOptions,
  NftTransferCallOptions,
  NftApproveOptions,
  NftRevokeOptions,
  NftRevokeAllOptions,
  StorageDepositOptions,
  StorageWithdrawOptions,
  StorageUnregisterOptions,
} from '../types';
import { Amount } from './Amount';
import { Gas } from './Gas';

export function fungibleTokenFunctionCall<T>(functionCall: FunctionCall<T>): FungibleTokenFunctionCall<T> {
  const transfer = (options: FtTransferOptions): T => {
    const { args, gas } = options;
    return functionCall({
      methodName: 'ft_transfer',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  };

  const transfer_call = (options: FtTransferCallOptions): T => {
    const { args, gas = Gas.parse(50, 'T') } = options;
    return functionCall({
      methodName: 'ft_transfer_call',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  };

  return { transfer, transfer_call };
}

export function nonFungibleTokenFunctionCall<T>(functionCall: FunctionCall<T>): NonFungibleTokenFunctionCall<T> {
  const transfer = (options: NftTransferOptions): T => {
    const { args, gas } = options;
    return functionCall({
      methodName: 'nft_transfer',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  };

  const transfer_call = (options: NftTransferCallOptions): T => {
    const { args, gas = Gas.parse(50, 'T') } = options;
    return functionCall({
      methodName: 'nft_transfer_call',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  };

  const approve = (options: NftApproveOptions): T => {
    const { args, attachedDeposit = Amount.parse('0.005', 'NEAR'), gas } = options;
    return functionCall({
      methodName: 'nft_approve',
      args,
      attachedDeposit,
      gas,
    });
  };

  const revoke = (options: NftRevokeOptions): T => {
    const { args, gas } = options;
    return functionCall({
      methodName: 'nft_revoke',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  };

  const revoke_all = (options: NftRevokeAllOptions): T => {
    const { args, gas } = options;
    return functionCall({
      methodName: 'nft_revoke_all',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  };

  return { transfer, transfer_call, approve, revoke, revoke_all };
}

export function storageManagementFunctionCall<T>(functionCall: FunctionCall<T>): StorageManagementFunctionCall<T> {
  const deposit = (options: StorageDepositOptions): T => {
    const { args, attachedDeposit, gas } = options;
    return functionCall({
      methodName: 'storage_deposit',
      args,
      attachedDeposit,
      gas,
    });
  };

  const withdraw = (options: StorageWithdrawOptions = {}): T => {
    const { args, gas } = options;
    return functionCall({
      methodName: 'storage_withdraw',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  };

  const unregister = (options: StorageUnregisterOptions = {}): T => {
    const { args, gas } = options;
    return functionCall({
      methodName: 'storage_unregister',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  };

  return { deposit, withdraw, unregister };
}
