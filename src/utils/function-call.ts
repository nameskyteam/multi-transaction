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
  const transfer = ({ args, gas }: FtTransferOptions): T =>
    functionCall({
      methodName: 'ft_transfer',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });

  const transfer_call = ({ args, gas }: FtTransferCallOptions): T => {
    return functionCall({
      methodName: 'ft_transfer_call',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas: gas ?? Gas.parse(50, 'T'),
    });
  };

  return { transfer, transfer_call };
}

export function nonFungibleTokenFunctionCall<T>(functionCall: FunctionCall<T>): NonFungibleTokenFunctionCall<T> {
  const transfer = ({ args, gas }: NftTransferOptions): T => {
    return functionCall({
      methodName: 'nft_transfer',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  };

  const transfer_call = ({ args, gas }: NftTransferCallOptions): T => {
    return functionCall({
      methodName: 'nft_transfer_call',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas: gas ?? Gas.parse(50, 'T'),
    });
  };

  const approve = ({ args, attachedDeposit, gas }: NftApproveOptions): T => {
    return functionCall({
      methodName: 'nft_approve',
      args,
      attachedDeposit: attachedDeposit ?? Amount.parse('0.005', 'NEAR'),
      gas,
    });
  };

  const revoke = ({ args, gas }: NftRevokeOptions): T => {
    return functionCall({
      methodName: 'nft_revoke',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  };

  const revoke_all = ({ args, gas }: NftRevokeAllOptions): T => {
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
  const deposit = ({ args, attachedDeposit, gas }: StorageDepositOptions): T => {
    return functionCall({
      methodName: 'storage_deposit',
      args,
      attachedDeposit,
      gas,
    });
  };

  const withdraw = ({ args, gas }: StorageWithdrawOptions): T => {
    return functionCall({
      methodName: 'storage_withdraw',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  };

  const unregister = ({ args, gas }: StorageUnregisterOptions): T => {
    return functionCall({
      methodName: 'storage_unregister',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  };

  return { deposit, withdraw, unregister };
}
