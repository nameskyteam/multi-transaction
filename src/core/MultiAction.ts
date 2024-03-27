import { Actions } from './Actions';
import {
  Amount,
  Gas,
  Stringifier,
  fungibleTokenFunctionCall,
  nonFungibleTokenFunctionCall,
  storageManagementFunctionCall,
} from '../utils';
import {
  EmptyArgs,
  AccessKey,
  Action,
  FunctionCallOptions,
  FungibleTokenFunctionCall,
  NonFungibleTokenFunctionCall,
  StorageManagementFunctionCall,
} from '../types';

export class MultiAction {
  private readonly actions: Action[];

  private constructor() {
    this.actions = [];
  }

  private addActions(actions: Action[]): this {
    this.actions.push(...actions);
    return this;
  }

  static fromActions(actions: Action[]): MultiAction {
    return MultiAction.new().addActions(actions);
  }

  toActions(): Action[] {
    return Array.from(this.actions);
  }

  extend(mAction: MultiAction): this {
    return this.addActions(mAction.actions);
  }

  static new(): MultiAction {
    return new MultiAction();
  }

  /**
   * Add a CreateAccount Action following previous actions
   */
  createAccount(): this {
    return this.addActions([Actions.createAccount()]);
  }

  /**
   * Add a DeleteAccount Action following previous actions
   */
  deleteAccount(beneficiaryId: string): this {
    return this.addActions([Actions.deleteAccount({ beneficiaryId })]);
  }

  /**
   * Add a AddKey Action following previous actions
   */
  addKey(publicKey: string, accessKey: AccessKey): this {
    return this.addActions([
      Actions.addKey({
        publicKey,
        accessKey,
      }),
    ]);
  }

  /**
   * Add a DeleteKey Action following previous actions
   */
  deleteKey(publicKey: string): this {
    return this.addActions([Actions.deleteKey({ publicKey })]);
  }

  /**
   * Add a DeployContract Action following previous actions
   */
  deployContract(code: Uint8Array): this {
    return this.addActions([Actions.deployContract({ code })]);
  }

  /**
   * Add a Stake Action following previous actions
   */
  stake(amount: string, publicKey: string): this {
    return this.addActions([Actions.stake({ amount, publicKey })]);
  }

  /**
   * Add a FunctionCall Action following previous actions
   */
  functionCall<Args = EmptyArgs>({
    methodName,
    args = {} as Args,
    attachedDeposit = Amount.ZERO,
    gas = Gas.DEFAULT,
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
   * Add a Transfer Action following previous actions
   */
  transfer(amount: string): this {
    return this.addActions([Actions.transfer({ amount })]);
  }

  get ft(): FungibleTokenFunctionCall<this> {
    return fungibleTokenFunctionCall((options) => this.functionCall(options));
  }

  get nft(): NonFungibleTokenFunctionCall<this> {
    return nonFungibleTokenFunctionCall((options) => this.functionCall(options));
  }

  get storage(): StorageManagementFunctionCall<this> {
    return storageManagementFunctionCall((options) => this.functionCall(options));
  }
}
