export type Transaction = {
  signerId?: string;
  receiverId: string;
  actions: Action[];
};

export type Action =
  | CreateAccountAction
  | DeleteAccountAction
  | AddKeyAction
  | DeleteKeyAction
  | DeployContractAction
  | DeployGlobalContractAction
  | UseGlobalContractAction
  | StakeAction
  | FunctionCallAction
  | TransferAction;

export type CreateAccountAction = {
  type: 'CreateAccount';
};

export type DeleteAccountAction = {
  type: 'DeleteAccount';
  params: DeleteAccountParams;
};

export type AddKeyAction = {
  type: 'AddKey';
  params: AddKeyParams;
};

export type DeleteKeyAction = {
  type: 'DeleteKey';
  params: DeleteKeyParams;
};

export type DeployContractAction = {
  type: 'DeployContract';
  params: DeployContractParams;
};

export type DeployGlobalContractAction = {
  type: 'DeployGlobalContract';
  params: DeployGlobalContractParams;
};

export type UseGlobalContractAction = {
  type: 'UseGlobalContract';
  params: UseGlobalContractParams;
};

export type StakeAction = {
  type: 'Stake';
  params: StakeParams;
};

export type FunctionCallAction = {
  type: 'FunctionCall';
  params: FunctionCallParams;
};

export type TransferAction = {
  type: 'Transfer';
  params: TransferParams;
};

export type DeleteAccountParams = {
  beneficiaryId: string;
};

export type AddKeyParams = {
  publicKey: string;
  accessKey: AccessKey;
};

export type DeleteKeyParams = {
  publicKey: string;
};

export type DeployContractParams = {
  code: Uint8Array;
};

export type DeployGlobalContractParams = {
  code: Uint8Array;
  deployMode: GlobalContractDeployMode;
};

export type UseGlobalContractParams = {
  contractIdentifier: GlobalContractIdentifier;
};

export type StakeParams = {
  amount: string;
  publicKey: string;
};

export type FunctionCallParams = {
  methodName: string;
  args: Uint8Array;
  attachedDeposit: string;
  gas: string;
};

export type TransferParams = {
  amount: string;
};

export type GlobalContractDeployMode = 'CodeHash' | 'AccountId';

export type GlobalContractIdentifier =
  | {
      type: 'CodeHash';
      codeHash: Uint8Array;
    }
  | {
      type: 'AccountId';
      accountId: string;
    };

export type AccessKey = {
  permission: AccessKeyPermission;
  nonce?: number;
};

export type AccessKeyPermission = 'FullAccess' | FunctionCallAccess;

export type FunctionCallAccess = {
  receiverId: string;
  methodNames: string[];
  allowance?: string;
};
