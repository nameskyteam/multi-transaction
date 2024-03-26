import {
  Actions,
  FungibleTokenFunctionCall,
  NonFungibleTokenFunctionCall,
  StorageManagementFunctionCall,
} from '../index';
import { AccessKey, Action } from '../../types';
import { Amount, Gas, Stringifier } from '../../utils';
import { EmptyArgs } from '../../types';
import { PublicKey } from 'near-api-js/lib/utils';

export class MultiAction {
  private readonly actions: Action[];

  private constructor() {
    this.actions = [];
  }

  addActions(actions: Action[]): this {
    this.actions.push(...actions);
    return this;
  }

  static new(): MultiAction {
    return new MultiAction();
  }

  static fromActions(actions: Action[]): MultiAction {
    return MultiAction.new().addActions(actions);
  }

  toActions(): Action[] {
    return Array.from(this.actions);
  }

  countActions(): number {
    return this.actions.length;
  }

  /**
   * Add a CreateAccount Action following the previous one.
   */
  createAccount(): this {
    return this.addActions([Actions.createAccount()]);
  }

  /**
   * Add a DeleteAccount Action following the previous one.
   * @param beneficiaryId beneficiary id
   */
  deleteAccount(beneficiaryId: string): this {
    return this.addActions([Actions.deleteAccount({ beneficiaryId })]);
  }

  /**
   * Add a AddKey Action following the previous one.
   * @param publicKey public key
   * @param accessKey access key
   */
  addKey(publicKey: string, accessKey: AccessKey): this {
    return this.addActions([
      Actions.addKey({
        publicKey: PublicKey.fromString(publicKey).toString(),
        accessKey,
      }),
    ]);
  }

  /**
   * Add a DeleteKey Action following the previous one.
   * @param publicKey public key
   */
  deleteKey(publicKey: string): this {
    return this.addActions([Actions.deleteKey({ publicKey: PublicKey.fromString(publicKey).toString() })]);
  }

  /**
   * Add a DeployContract Action following the previous one.
   * @param code code
   */
  deployContract(code: Uint8Array): this {
    return this.addActions([Actions.deployContract({ code })]);
  }

  /**
   * Add a Stake Action following the previous one.
   * @param amount amount
   * @param publicKey public key
   */
  stake(amount: string, publicKey: string): this {
    return this.addActions([Actions.stake({ amount, publicKey: PublicKey.fromString(publicKey).toString() })]);
  }

  /**
   * Add a FunctionCall Action following the previous one.
   * @param methodName method name
   * @param args args
   * @param attachedDeposit attached deposit
   * @param gas gas
   * @param stringifier stringifier
   */
  functionCall<Args = EmptyArgs>({
    methodName,
    args = {} as Args,
    attachedDeposit = Amount.ZERO,
    gas = Gas.default(),
    stringifier = Stringifier.json(),
  }: FunctionCallOptions<Args>): this {
    return this.addActions([
      Actions.functionCall({
        methodName,
        args: stringifier.stringifyOrSkip(args),
        attachedDeposit,
        gas,
      }),
    ]);
  }

  /**
   * Add a Transfer Action following the previous one.
   * @param amount amount
   */
  transfer(amount: string): this {
    return this.addActions([Actions.transfer({ amount })]);
  }

  /**
   * FungibleToken Helper
   */
  get ft(): FungibleTokenFunctionCall<this> {
    return new FungibleTokenFunctionCall(this);
  }

  /**
   * NonFungibleToken Helper
   */
  get nft(): NonFungibleTokenFunctionCall<this> {
    return new NonFungibleTokenFunctionCall(this);
  }

  /**
   * StorageManagement Helper
   */
  get storage(): StorageManagementFunctionCall<this> {
    return new StorageManagementFunctionCall(this);
  }
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
