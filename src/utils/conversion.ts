import { AccessKey, Action } from '../types';
import * as nearApiJs from 'near-api-js';
import { Transaction } from '../types';
import { MultiTransaction } from '../core';
import * as nearWalletSelector from '@near-wallet-selector/core';
import BN from 'bn.js';

export function parseNearApiJsTransactions(mTx: MultiTransaction): NearApiJsTransactionLike[] {
  return mTx.toTransactions().map((transaction) => parseNearApiJsTransaction(transaction));
}

function parseNearApiJsTransaction({ receiverId, actions }: Transaction): NearApiJsTransactionLike {
  return {
    receiverId,
    actions: actions.map((action) => parseNearApiJsAction(action)),
  };
}

function parseNearApiJsAction(action: Action): NearApiJsActionLike {
  switch (action.type) {
    case 'CreateAccount': {
      return nearApiJs.transactions.createAccount();
    }
    case 'DeleteAccount': {
      return nearApiJs.transactions.deleteAccount(action.params.beneficiaryId);
    }
    case 'AddKey': {
      return nearApiJs.transactions.addKey(
        nearApiJs.utils.PublicKey.fromString(action.params.publicKey),
        parseNearApiJsAccessKey(action.params.accessKey),
      );
    }
    case 'DeleteKey': {
      return nearApiJs.transactions.deleteKey(nearApiJs.utils.PublicKey.fromString(action.params.publicKey));
    }
    case 'DeployContract': {
      return nearApiJs.transactions.deployContract(action.params.code);
    }
    case 'Stake': {
      return nearApiJs.transactions.stake(
        new BN(action.params.amount),
        nearApiJs.utils.PublicKey.fromString(action.params.publicKey),
      );
    }
    case 'FunctionCall': {
      return nearApiJs.transactions.functionCall(
        action.params.methodName,
        action.params.args,
        new BN(action.params.gas),
        new BN(action.params.attachedDeposit),
      );
    }
    case 'Transfer': {
      return nearApiJs.transactions.transfer(new BN(action.params.amount));
    }
  }
}

function parseNearApiJsAccessKey(accessKey: AccessKey): nearApiJs.transactions.AccessKey {
  const { permission } = accessKey;
  if (permission === 'FullAccess') {
    return nearApiJs.transactions.fullAccessKey();
  } else {
    const { receiverId, methodNames, allowance } = permission;
    return nearApiJs.transactions.functionCallAccessKey(
      receiverId,
      methodNames,
      allowance ? new BN(allowance) : undefined,
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
  return {
    signerId,
    receiverId,
    actions: actions.map((action) => parseNearWalletSelectorAction(action)),
  };
}

function parseNearWalletSelectorAction(action: Action): NearWalletSelectorActionLike {
  switch (action.type) {
    case 'CreateAccount': {
      return action;
    }
    case 'DeleteAccount': {
      return action;
    }
    case 'AddKey': {
      return action;
    }
    case 'DeleteKey': {
      return action;
    }
    case 'DeployContract': {
      return action;
    }
    case 'Stake': {
      const { amount, publicKey } = action.params;
      return {
        type: action.type,
        params: {
          stake: amount,
          publicKey,
        },
      };
    }
    case 'FunctionCall': {
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
    case 'Transfer': {
      const { amount } = action.params;
      return {
        type: action.type,
        params: {
          deposit: amount,
        },
      };
    }
  }
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
