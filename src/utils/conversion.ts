import { AccessKey, Action } from '../types';
import * as nearApiJs from 'near-api-js';
import { Transaction } from '../types';
import { MultiTransaction } from '../core';
import * as nearWalletSelector from '@near-wallet-selector/core';
import BN from 'bn.js';
import { ParseTransactionError } from '../errors';
import { unreachable } from './common';

export function parseNearApiJsTransactions(mTx: MultiTransaction): NearApiJsTransactionLike[] {
  return mTx.toTransactions().map((transaction) => parseNearApiJsTransaction(transaction));
}

function parseNearApiJsTransaction({ receiverId, actions }: Transaction): NearApiJsTransactionLike {
  if (!receiverId) {
    throw new ParseTransactionError('Transaction must have `receiverId`');
  }

  return {
    receiverId,
    actions: actions.map((action) => parseNearApiJsAction(action)),
  };
}

function parseNearApiJsAction(action: Action): NearApiJsActionLike {
  if (action.type === 'CreateAccount') {
    return nearApiJs.transactions.createAccount();
  }

  if (action.type === 'DeleteAccount') {
    return nearApiJs.transactions.deleteAccount(action.params.beneficiaryId);
  }

  if (action.type === 'AddKey') {
    return nearApiJs.transactions.addKey(
      nearApiJs.utils.PublicKey.fromString(action.params.publicKey),
      parseNearApiJsAccessKey(action.params.accessKey),
    );
  }

  if (action.type === 'DeleteKey') {
    return nearApiJs.transactions.deleteKey(nearApiJs.utils.PublicKey.fromString(action.params.publicKey));
  }

  if (action.type === 'DeployContract') {
    return nearApiJs.transactions.deployContract(action.params.code);
  }

  if (action.type === 'Stake') {
    return nearApiJs.transactions.stake(
      new BN(action.params.amount),
      nearApiJs.utils.PublicKey.fromString(action.params.publicKey),
    );
  }

  if (action.type === 'FunctionCall') {
    return nearApiJs.transactions.functionCall(
      action.params.methodName,
      action.params.args,
      new BN(action.params.gas),
      new BN(action.params.attachedDeposit),
    );
  }

  if (action.type === 'Transfer') {
    return nearApiJs.transactions.transfer(new BN(action.params.amount));
  }

  unreachable();
}

function parseNearApiJsAccessKey(accessKey: AccessKey): nearApiJs.transactions.AccessKey {
  if (accessKey.permission === 'FullAccess') {
    return nearApiJs.transactions.fullAccessKey();
  } else {
    return nearApiJs.transactions.functionCallAccessKey(
      accessKey.permission.receiverId,
      accessKey.permission.methodNames,
      accessKey.permission.allowance ? new BN(accessKey.permission.allowance) : undefined,
    );
  }
}

export function parseNearWalletSelectorTransactions(mTx: MultiTransaction) {
  return mTx.toTransactions().map((transaction) => parseNearWalletSelectorTransaction(transaction));
}

function parseNearWalletSelectorTransaction({
  signerId,
  receiverId,
  actions,
}: Transaction): NearWalletSelectorTransactionLike {
  if (!receiverId) {
    throw new ParseTransactionError('Transaction must have `receiverId`');
  }

  return {
    signerId,
    receiverId,
    actions: actions.map((action) => parseNearWalletSelectorAction(action)),
  };
}

function parseNearWalletSelectorAction(action: Action): NearWalletSelectorActionLike {
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

export type NearApiJsTransactionLike = {
  receiverId: string;
  actions: NearApiJsActionLike[];
};

export type NearApiJsActionLike = nearApiJs.transactions.Action;

export type NearWalletSelectorTransactionLike = {
  signerId?: string;
  receiverId: string;
  actions: NearWalletSelectorActionLike[];
};

export type NearWalletSelectorActionLike = nearWalletSelector.Action;
