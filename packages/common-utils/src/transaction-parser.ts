import {
  MultiTransaction,
  Transaction,
  Action,
  AccessKey,
  UnreachableError,
} from '@multi-transaction/core';
import { PublicKey } from '@near-js/crypto';
import {
  actionCreators,
  Action as NearAction,
  AccessKey as NearAccessKey,
} from '@near-js/transactions';

export type NearTransaction = {
  signerId?: string;
  receiverId: string;
  actions: NearAction[];
};

export function parseNearTransactions(
  mTransaction: MultiTransaction,
): NearTransaction[] {
  return mTransaction
    .toTransactions()
    .map((transaction) => parseNearTransaction(transaction));
}

export function parseNearTransaction(
  transaction: Transaction,
): NearTransaction {
  const { signerId, receiverId, actions } = transaction;
  return {
    signerId,
    receiverId,
    actions: actions.map((action) => parseNearAction(action)),
  };
}

function parseNearAction(action: Action): NearAction {
  if (action.type === 'CreateAccount') {
    return actionCreators.createAccount();
  }

  if (action.type === 'DeleteAccount') {
    const { beneficiaryId } = action.params;
    return actionCreators.deleteAccount(beneficiaryId);
  }

  if (action.type === 'AddKey') {
    const { publicKey, accessKey } = action.params;
    return actionCreators.addKey(
      PublicKey.fromString(publicKey),
      parseNearAccessKey(accessKey),
    );
  }

  if (action.type === 'DeleteKey') {
    const { publicKey } = action.params;
    return actionCreators.deleteKey(PublicKey.fromString(publicKey));
  }

  if (action.type === 'DeployContract') {
    const { code } = action.params;
    return actionCreators.deployContract(code);
  }

  if (action.type === 'Stake') {
    const { amount, publicKey } = action.params;
    return actionCreators.stake(
      BigInt(amount),
      PublicKey.fromString(publicKey),
    );
  }

  if (action.type === 'FunctionCall') {
    const { methodName, args, gas, attachedDeposit } = action.params;
    return actionCreators.functionCall(
      methodName,
      args,
      BigInt(gas),
      BigInt(attachedDeposit),
    );
  }

  if (action.type === 'Transfer') {
    const { amount } = action.params;
    return actionCreators.transfer(BigInt(amount));
  }

  throw new UnreachableError();
}

function parseNearAccessKey(accessKey: AccessKey): NearAccessKey {
  if (accessKey.permission === 'FullAccess') {
    return actionCreators.fullAccessKey();
  } else {
    const { receiverId, methodNames, allowance } = accessKey.permission;
    return actionCreators.functionCallAccessKey(
      receiverId,
      methodNames,
      allowance ? BigInt(allowance) : undefined,
    );
  }
}
