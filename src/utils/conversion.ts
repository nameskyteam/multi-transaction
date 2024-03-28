import { Action as NearWalletSelectorAction } from '@near-wallet-selector/core';
import BN from 'bn.js';
import { PublicKey } from 'near-api-js/lib/utils';
import {
  addKey,
  createAccount,
  deleteAccount,
  deleteKey,
  deployContract,
  fullAccessKey,
  functionCall,
  functionCallAccessKey,
  stake,
  transfer,
  Action as NearApiJsAction,
  AccessKey as NearApiJsAccessKey,
} from 'near-api-js/lib/transaction';
import { AccessKey, Action, Transaction } from '../types';
import { MultiTransaction } from '../core';
import { unreachable } from './common';

export function parseNearApiJsTransactions(mTransaction: MultiTransaction): NearApiJsTransaction[] {
  return mTransaction.toTransactions().map((transaction) => parseNearApiJsTransaction(transaction));
}

function parseNearApiJsTransaction(transaction: Transaction): NearApiJsTransaction {
  const { receiverId, actions } = transaction;
  return {
    receiverId,
    actions: actions.map((action) => parseNearApiJsAction(action)),
  };
}

function parseNearApiJsAction(action: Action): NearApiJsAction {
  if (action.type === 'CreateAccount') {
    return createAccount();
  }

  if (action.type === 'DeleteAccount') {
    const { beneficiaryId } = action.params;
    return deleteAccount(beneficiaryId);
  }

  if (action.type === 'AddKey') {
    const { publicKey, accessKey } = action.params;
    return addKey(PublicKey.fromString(publicKey), parseNearApiJsAccessKey(accessKey));
  }

  if (action.type === 'DeleteKey') {
    const { publicKey } = action.params;
    return deleteKey(PublicKey.fromString(publicKey));
  }

  if (action.type === 'DeployContract') {
    const { code } = action.params;
    return deployContract(code);
  }

  if (action.type === 'Stake') {
    const { amount, publicKey } = action.params;
    return stake(new BN(amount), PublicKey.fromString(publicKey));
  }

  if (action.type === 'FunctionCall') {
    const { methodName, args, gas, attachedDeposit } = action.params;
    return functionCall(methodName, args, new BN(gas), new BN(attachedDeposit));
  }

  if (action.type === 'Transfer') {
    const { amount } = action.params;
    return transfer(new BN(amount));
  }

  unreachable();
}

function parseNearApiJsAccessKey(accessKey: AccessKey): NearApiJsAccessKey {
  if (accessKey.permission === 'FullAccess') {
    return fullAccessKey();
  } else {
    const { receiverId, methodNames, allowance } = accessKey.permission;
    return functionCallAccessKey(receiverId, methodNames, allowance ? new BN(allowance) : undefined);
  }
}

export function parseNearWalletSelectorTransactions(mTransaction: MultiTransaction): NearWalletSelectorTransaction[] {
  return mTransaction.toTransactions().map((transaction) => parseNearWalletSelectorTransaction(transaction));
}

function parseNearWalletSelectorTransaction(transaction: Transaction): NearWalletSelectorTransaction {
  const { signerId, receiverId, actions } = transaction;
  return {
    signerId,
    receiverId,
    actions: actions.map((action) => parseNearWalletSelectorAction(action)),
  };
}

function parseNearWalletSelectorAction(action: Action): NearWalletSelectorAction {
  if (
    action.type === 'CreateAccount' ||
    action.type === 'DeleteAccount' ||
    action.type === 'AddKey' ||
    action.type === 'DeleteKey' ||
    action.type === 'DeployContract'
  ) {
    return action;
  }

  if (action.type === 'Stake') {
    const { amount, publicKey } = action.params;
    return {
      type: action.type,
      params: {
        stake: amount,
        publicKey,
      },
    };
  }

  if (action.type === 'FunctionCall') {
    const { methodName, args, gas, attachedDeposit } = action.params;
    return {
      type: action.type,
      params: {
        methodName,
        args,
        gas,
        deposit: attachedDeposit,
      },
    };
  }

  if (action.type === 'Transfer') {
    const { amount } = action.params;
    return {
      type: action.type,
      params: {
        deposit: amount,
      },
    };
  }

  unreachable();
}

export type NearApiJsTransaction = {
  receiverId: string;
  actions: NearApiJsAction[];
};

export type NearWalletSelectorTransaction = {
  signerId?: string;
  receiverId: string;
  actions: NearWalletSelectorAction[];
};
