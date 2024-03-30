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
import { AccessKey, Action, Transaction, MultiTransaction, UnreachableError } from '@multi-transaction/core';
import { NearApiJsTransaction } from './types';

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

  throw new UnreachableError();
}

function parseNearApiJsAccessKey(accessKey: AccessKey): NearApiJsAccessKey {
  if (accessKey.permission === 'FullAccess') {
    return fullAccessKey();
  } else {
    const { receiverId, methodNames, allowance } = accessKey.permission;
    return functionCallAccessKey(receiverId, methodNames, allowance ? new BN(allowance) : undefined);
  }
}
