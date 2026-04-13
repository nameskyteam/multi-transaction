import {
  CreateAccountAction,
  DeleteAccountAction,
  AddKeyAction,
  DeleteKeyAction,
  DeployContractAction,
  DeployGlobalContractAction,
  UseGlobalContractAction,
  StakeAction,
  FunctionCallAction,
  TransferAction,
  DeleteAccountParams,
  AddKeyParams,
  DeleteKeyParams,
  DeployContractParams,
  DeployGlobalContractParams,
  UseGlobalContractParams,
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

  static deployGlobalContract(
    params: DeployGlobalContractParams,
  ): DeployGlobalContractAction {
    return {
      type: 'DeployGlobalContract',
      params,
    };
  }

  static useGlobalContract(
    params: UseGlobalContractParams,
  ): UseGlobalContractAction {
    return {
      type: 'UseGlobalContract',
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
