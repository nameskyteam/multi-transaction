import { Action as WalletSelectorAction } from '@near-wallet-selector/core';
import { Action, Transaction, MultiTransaction, UnreachableError } from '@multi-transaction/core';
import { WalletSelectorTransaction } from './types';

export function parseWalletSelectorTransactions(mTransaction: MultiTransaction): WalletSelectorTransaction[] {
  return mTransaction.toTransactions().map((transaction) => parseWalletSelectorTransaction(transaction));
}

function parseWalletSelectorTransaction(transaction: Transaction): WalletSelectorTransaction {
  const { signerId, receiverId, actions } = transaction;
  return {
    signerId,
    receiverId,
    actions: actions.map((action) => parseWalletSelectorAction(action)),
  };
}

function parseWalletSelectorAction(action: Action): WalletSelectorAction {
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

  throw new UnreachableError();
}
