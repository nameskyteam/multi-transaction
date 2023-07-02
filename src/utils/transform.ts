import { AccessKey, Action } from '../types';
import * as nearApiJs from 'near-api-js';
import { Transaction } from '../types';
import { MultiTransaction } from '../core';
import * as nearWalletSelector from '@near-wallet-selector/core';
import BN from 'bn.js';

export function parseNearApiJsTransactions(multiTransaction: MultiTransaction): NearApiJsTransactionLike[] {
  return multiTransaction.toTransactions().map((transaction) => parseNearApiJsTransaction(transaction));
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
      const { beneficiaryId } = action.params;
      return nearApiJs.transactions.deleteAccount(beneficiaryId);
    }
    case 'AddKey': {
      const { publicKey, accessKey } = action.params;
      return nearApiJs.transactions.addKey(
        nearApiJs.utils.PublicKey.fromString(publicKey),
        parseNearApiJsAccessKey(accessKey)
      );
    }
    case 'DeleteKey': {
      const { publicKey } = action.params;
      return nearApiJs.transactions.deleteKey(nearApiJs.utils.PublicKey.fromString(publicKey));
    }
    case 'DeployContract': {
      const { code } = action.params;
      return nearApiJs.transactions.deployContract(code);
    }
    case 'Stake': {
      const { amount, publicKey } = action.params;
      return nearApiJs.transactions.stake(new BN(amount), nearApiJs.utils.PublicKey.fromString(publicKey));
    }
    case 'FunctionCall': {
      const { methodName, args, gas, attachedDeposit } = action.params;
      return nearApiJs.transactions.functionCall(methodName, args, new BN(gas), new BN(attachedDeposit));
    }
    case 'Transfer': {
      const { amount } = action.params;
      return nearApiJs.transactions.transfer(new BN(amount));
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
      allowance ? new BN(allowance) : undefined
    );
  }
}

export function parseNearWalletSelectorTransactions(multiTransaction: MultiTransaction) {
  return multiTransaction.toTransactions().map((transaction) => parseNearWalletSelectorTransaction(transaction));
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

export interface NearApiJsTransactionLike {
  receiverId: string;
  actions: NearApiJsActionLike[];
}

type NearApiJsActionLike = nearApiJs.transactions.Action;

export interface NearWalletSelectorTransactionLike {
  signerId?: string;
  receiverId: string;
  actions: NearWalletSelectorActionLike[];
}

type NearWalletSelectorActionLike = nearWalletSelector.Action;
