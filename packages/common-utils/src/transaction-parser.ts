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
  Action as NearApiJsAction,
  AccessKey as NearApiJsAccessKey,
} from '@near-js/transactions';

export type NearApiJsTransaction = {
  receiverId: string;
  actions: NearApiJsAction[];
};

export function parseNearApiJsTransactions(
  mTransaction: MultiTransaction,
): NearApiJsTransaction[] {
  return mTransaction
    .toTransactions()
    .map((transaction) => parseNearApiJsTransaction(transaction));
}

export function parseNearApiJsTransaction(
  transaction: Transaction,
): NearApiJsTransaction {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const { signerId, receiverId, actions } = transaction;
  return {
    receiverId,
    actions: actions.map((action) => parseNearApiJsAction(action)),
  };
}

function parseNearApiJsAction(action: Action): NearApiJsAction {
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
      parseNearApiJsAccessKey(accessKey),
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

function parseNearApiJsAccessKey(accessKey: AccessKey): NearApiJsAccessKey {
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
