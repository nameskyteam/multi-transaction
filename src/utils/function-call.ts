import {
  FunctionCall,
  FungibleTokenFunctionCall,
  NonFungibleTokenFunctionCall,
  StorageManagementFunctionCall,
} from '../types';
import { Amount } from './Amount';
import { Gas } from './Gas';

export function fungibleTokenFunctionCall<T>(functionCall: FunctionCall<T>): FungibleTokenFunctionCall<T> {
  return {
    transfer: ({ args, gas }) => {
      return functionCall({
        methodName: 'ft_transfer',
        args,
        attachedDeposit: Amount.ONE_YOCTO,
        gas,
      });
    },

    transfer_call: ({ args, gas }) => {
      return functionCall({
        methodName: 'ft_transfer_call',
        args,
        attachedDeposit: Amount.ONE_YOCTO,
        gas: gas ?? Gas.parse(50, 'T'),
      });
    },
  };
}

export function nonFungibleTokenFunctionCall<T>(functionCall: FunctionCall<T>): NonFungibleTokenFunctionCall<T> {
  return {
    transfer: ({ args, gas }) => {
      return functionCall({
        methodName: 'nft_transfer',
        args,
        attachedDeposit: Amount.ONE_YOCTO,
        gas,
      });
    },

    transfer_call: ({ args, gas }) => {
      return functionCall({
        methodName: 'nft_transfer_call',
        args,
        attachedDeposit: Amount.ONE_YOCTO,
        gas: gas ?? Gas.parse(50, 'T'),
      });
    },

    approve: ({ args, attachedDeposit, gas }) => {
      return functionCall({
        methodName: 'nft_approve',
        args,
        attachedDeposit: attachedDeposit ?? Amount.parse('0.005', 'NEAR'),
        gas,
      });
    },

    revoke: ({ args, gas }) => {
      return functionCall({
        methodName: 'nft_revoke',
        args,
        attachedDeposit: Amount.ONE_YOCTO,
        gas,
      });
    },

    revoke_all: ({ args, gas }) => {
      return functionCall({
        methodName: 'nft_revoke_all',
        args,
        attachedDeposit: Amount.ONE_YOCTO,
        gas,
      });
    },
  };
}

export function storageManagementFunctionCall<T>(functionCall: FunctionCall<T>): StorageManagementFunctionCall<T> {
  return {
    deposit: ({ args, attachedDeposit, gas }) => {
      return functionCall({
        methodName: 'storage_deposit',
        args,
        attachedDeposit,
        gas,
      });
    },

    withdraw: ({ args, gas }) => {
      return functionCall({
        methodName: 'storage_withdraw',
        args,
        attachedDeposit: Amount.ONE_YOCTO,
        gas,
      });
    },

    unregister: ({ args, gas }) => {
      return functionCall({
        methodName: 'storage_unregister',
        args,
        attachedDeposit: Amount.ONE_YOCTO,
        gas,
      });
    },
  };
}
