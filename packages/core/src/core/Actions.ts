import {
  CreateAccountAction,
  DeleteAccountAction,
  AddKeyAction,
  DeleteKeyAction,
  DeployContractAction,
  StakeAction,
  FunctionCallAction,
  TransferAction,
  DeleteAccountParams,
  AddKeyParams,
  DeleteKeyParams,
  DeployContractParams,
  StakeParams,
  FunctionCallParams,
  TransferParams,
} from '../types';

export class Actions {
  private constructor() {}

  static createAccount(): CreateAccountAction {
    return {
      type: 'CreateAccount',
    };
  }

  static deleteAccount(params: DeleteAccountParams): DeleteAccountAction {
    return {
      type: 'DeleteAccount',
      params,
    };
  }

  static addKey(params: AddKeyParams): AddKeyAction {
    return {
      type: 'AddKey',
      params,
    };
  }

  static deleteKey(params: DeleteKeyParams): DeleteKeyAction {
    return {
      type: 'DeleteKey',
      params,
    };
  }

  static deployContract(params: DeployContractParams): DeployContractAction {
    return {
      type: 'DeployContract',
      params,
    };
  }

  static stake(params: StakeParams): StakeAction {
    return {
      type: 'Stake',
      params,
    };
  }

  static functionCall(params: FunctionCallParams): FunctionCallAction {
    return {
      type: 'FunctionCall',
      params,
    };
  }

  static transfer(params: TransferParams): TransferAction {
    return {
      type: 'Transfer',
      params,
    };
  }
}
