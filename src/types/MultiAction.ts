import {
  EmptyArgs,
  FunctionCallOptions,
  FungibleTokenFunctionCall,
  NonFungibleTokenFunctionCall,
  StorageManagementFunctionCall,
} from '../core';
import { AccessKey, Action, Transaction } from './transaction';

export interface MultiAction {
  createAccount(): this;
  deleteAccount(beneficiaryId: string): this;
  addKey(publicKey: string, accessKey: AccessKey): this;
  deleteKey(publicKey: string): this;
  deployContract(code: Uint8Array): this;
  stake(amount: string, publicKey: string): this;
  functionCall<Args = EmptyArgs>(options: FunctionCallOptions<Args>): this;
  transfer(amount: string): this;
  get ft(): FungibleTokenFunctionCall<this>;
  get nft(): NonFungibleTokenFunctionCall<this>;
  get storage(): StorageManagementFunctionCall<this>;
  extendActions(mTx: this): this;
  toTransactions(): Transaction[];
  toActions(): Action[];
  countActions(): number;
}
