import { FungibleTokenFunctionCall, NonFungibleTokenFunctionCall, StorageManagementFunctionCall } from '../core';
import { AccessKey, Action } from './transaction';
import { Stringifier } from '../utils';
import { EmptyArgs } from './common';

export interface ActionContainer
  extends MultiCreateAccount,
    MultiDeleteAccount,
    MultiAddKey,
    MultiDeleteKey,
    MultiDeployContract,
    MultiStake,
    MultiFunctionCall,
    MultiTransfer {
  get ft(): FungibleTokenFunctionCall<this>;
  get nft(): NonFungibleTokenFunctionCall<this>;
  get storage(): StorageManagementFunctionCall<this>;
  extendActions(container: ActionContainer): this;
  countActions(): number;
  toActions(): Action[];
}

export interface MultiCreateAccount {
  createAccount(): this;
}

export interface MultiDeleteAccount {
  deleteAccount(beneficiaryId: string): this;
}

export interface MultiAddKey {
  addKey(publicKey: string, accessKey: AccessKey): this;
}

export interface MultiDeleteKey {
  deleteKey(publicKey: string): this;
}

export interface MultiDeployContract {
  deployContract(code: Uint8Array): this;
}

export interface MultiStake {
  stake(amount: string, publicKey: string): this;
}

export interface MultiFunctionCall {
  functionCall<Args = EmptyArgs>(options: FunctionCallOptions<Args>): this;
}

export interface MultiTransfer {
  transfer(amount: string): this;
}

export type FunctionCallOptions<Args> = {
  methodName: string;
  args?: Args;
  attachedDeposit?: string;
  gas?: string;
  stringifier?: Stringifier<Args>;
};
