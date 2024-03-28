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

function parseNearApiJsTransaction({ receiverId, actions }: Transaction): NearApiJsTransaction {
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
    return deleteAccount(action.params.beneficiaryId);
  }

  if (action.type === 'AddKey') {
    return addKey(PublicKey.fromString(action.params.publicKey), parseNearApiJsAccessKey(action.params.accessKey));
  }

  if (action.type === 'DeleteKey') {
    return deleteKey(PublicKey.fromString(action.params.publicKey));
  }

  if (action.type === 'DeployContract') {
    return deployContract(action.params.code);
  }

  if (action.type === 'Stake') {
    return stake(new BN(action.params.amount), PublicKey.fromString(action.params.publicKey));
  }

  if (action.type === 'FunctionCall') {
    return functionCall(
      action.params.methodName,
      action.params.args,
      new BN(action.params.gas),
      new BN(action.params.attachedDeposit),
    );
  }

  if (action.type === 'Transfer') {
    return transfer(new BN(action.params.amount));
  }

  unreachable();
}

function parseNearApiJsAccessKey(accessKey: AccessKey): NearApiJsAccessKey {
  if (accessKey.permission === 'FullAccess') {
    return fullAccessKey();
  } else {
    return functionCallAccessKey(
      accessKey.permission.receiverId,
      accessKey.permission.methodNames,
      accessKey.permission.allowance ? new BN(accessKey.permission.allowance) : undefined,
    );
  }
}

export function parseNearWalletSelectorTransactions(mTransaction: MultiTransaction): NearWalletSelectorTransaction[] {
  return mTransaction.toTransactions().map((transaction) => parseNearWalletSelectorTransaction(transaction));
}

function parseNearWalletSelectorTransaction({
  signerId,
  receiverId,
  actions,
}: Transaction): NearWalletSelectorTransaction {
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
    return {
      type: action.type,
      params: {
        stake: action.params.amount,
        publicKey: action.params.publicKey,
      },
    };
  }

  if (action.type === 'FunctionCall') {
    return {
      type: action.type,
      params: {
        methodName: action.params.methodName,
        args: action.params.args,
        gas: action.params.gas,
        deposit: action.params.attachedDeposit,
      },
    };
  }

  if (action.type === 'Transfer') {
    return {
      type: action.type,
      params: {
        deposit: action.params.amount,
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
