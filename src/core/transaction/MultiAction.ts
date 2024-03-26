import { Actions } from '../index';
import { AccessKey, Action } from '../../types';
import {
  Amount,
  fungibleTokenFunctionCall,
  Gas,
  nonFungibleTokenFunctionCall,
  storageManagementFunctionCall,
  Stringifier,
} from '../../utils';
import { EmptyArgs } from '../../types';
import {
  FunctionCallOptions,
  FungibleTokenFunctionCall,
  NonFungibleTokenFunctionCall,
  StorageManagementFunctionCall,
} from '../../types/function-call';

export class MultiAction {
  private readonly actions: Action[];

  private constructor() {
    this.actions = [];
  }

  private addActions(actions: Action[]): this {
    this.actions.push(...actions);
    return this;
  }

  /**
   * Create a new `MultiAction` from actions.
   */
  static fromActions(actions: Action[]): MultiAction {
    return MultiAction.new().addActions(actions);
  }

  /**
   * Return actions.
   */
  toActions(): Action[] {
    return Array.from(this.actions);
  }

  /**
   * Number of actions.
   */
  num(): number {
    return this.actions.length;
  }

  /**
   * Extend actions.
   */
  extend(mx: MultiAction): this {
    const actions = mx.toActions();
    return this.addActions(actions);
  }

  /**
   * Create a new `MultiAction`.
   */
  static new(): MultiAction {
    return new MultiAction();
  }

  /**
   * Add a CreateAccount Action following the previous one.
   */
  createAccount(): this {
    return this.addActions([Actions.createAccount()]);
  }

  /**
   * Add a DeleteAccount Action following the previous one.
   */
  deleteAccount(beneficiaryId: string): this {
    return this.addActions([Actions.deleteAccount({ beneficiaryId })]);
  }

  /**
   * Add a AddKey Action following the previous one.
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
   * Add a DeleteKey Action following the previous one.
   */
  deleteKey(publicKey: string): this {
    return this.addActions([Actions.deleteKey({ publicKey })]);
  }

  /**
   * Add a DeployContract Action following the previous one.
   */
  deployContract(code: Uint8Array): this {
    return this.addActions([Actions.deployContract({ code })]);
  }

  /**
   * Add a Stake Action following the previous one.
   */
  stake(amount: string, publicKey: string): this {
    return this.addActions([Actions.stake({ amount, publicKey })]);
  }

  /**
   * Add a FunctionCall Action following the previous one.
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
