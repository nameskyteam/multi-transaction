import { FunctionCallOptions, EmptyArgs } from '../../types';
import { Actions } from './Actions';
import { Transaction, AccessKey, Action } from '../../types';
import { Amount, Gas } from '../../utils';
import { PublicKey } from 'near-api-js/lib/utils';
import {
  FungibleTokenFunctionCallWrapper,
  StorageManagementFunctionCallWrapper,
  NonFubgibleTokenFunctionCallWrapper,
} from './function-call-wrapper';
import { Stringifier } from '../../stringifier';

/**
 * Helper for creating transaction(s).
 */
export class MultiTransaction {
  private readonly transactions: Transaction[];

  private constructor() {
    this.transactions = [];
  }

  /**
   * Create an instance that contains no transaction.
   */
  static new(): MultiTransaction {
    return new MultiTransaction();
  }

  /**
   * Create a transaction.
   * @param receiverId Transaction receiver id
   * @param signerId Transaction signer id
   */
  static batch(receiverId: string, signerId?: string): MultiTransaction {
    return MultiTransaction.new().batch(receiverId, signerId);
  }

  /**
   * Create a transaction.
   * @param receiverId Transaction receiver id
   * @param signerId Transaction signer id
   */
  batch(receiverId: string, signerId?: string): this {
    return this.addTransactions([{ signerId, receiverId, actions: [] }]);
  }

  /**
   * Extend other.
   * @param other Other
   */
  extend(other: MultiTransaction): this {
    return this.addTransactions(other.toTransactions());
  }

  /**
   * If it contains no transaction, return `true`, else return `false`.
   */
  isEmpty(): boolean {
    return this.transactions.length === 0;
  }

  /**
   * Count transactions.
   */
  countTransactions(): number {
    return this.transactions.length;
  }

  /**
   * Count actions of the transaction.
   */
  countActions(): number {
    const transaction = this.getTheTransaction();
    return transaction.actions.length;
  }

  static fromTransactions(transactions: Transaction[]): MultiTransaction {
    return MultiTransaction.new().addTransactions(transactions);
  }

  toTransactions(): Transaction[] {
    return Array.from(this.transactions);
  }

  private addTransactions(transactions: Transaction[]): this {
    this.transactions.push(...transactions);
    return this;
  }

  private addActions(actions: Action[]): this {
    const transaction = this.getTheTransaction();
    transaction.actions.push(...actions);
    return this;
  }

  /**
   * Get the transaction.
   */
  private getTheTransaction(): Transaction {
    return this.transactions[this.transactions.length - 1];
  }

  // -------------------------------------------- Actions --------------------------------------------------
  createAccount(): this {
    return this.addActions([Actions.createAccount()]);
  }

  deleteAccount(beneficiaryId: string): this {
    return this.addActions([Actions.deleteAccount({ beneficiaryId })]);
  }

  addKey(publicKey: string, accessKey: AccessKey): this {
    return this.addActions([
      Actions.addKey({
        publicKey: PublicKey.fromString(publicKey).toString(),
        accessKey,
      }),
    ]);
  }

  deleteKey(publicKey: string): this {
    return this.addActions([Actions.deleteKey({ publicKey: PublicKey.fromString(publicKey).toString() })]);
  }

  deployContract(code: Uint8Array): this {
    return this.addActions([Actions.deployContract({ code })]);
  }

  stake(amount: string, publicKey: string): this {
    return this.addActions([Actions.stake({ amount, publicKey: PublicKey.fromString(publicKey).toString() })]);
  }

  functionCall<Args = EmptyArgs>({
    methodName,
    args,
    attachedDeposit = Amount.ZERO,
    gas = Gas.default(),
    stringifier = Stringifier.json(),
  }: FunctionCallOptions<Args>): this {
    return this.addActions([
      Actions.functionCall({
        methodName,
        args: stringifier.stringifyOrSkip(args ?? ({} as Args)),
        attachedDeposit,
        gas,
      }),
    ]);
  }

  transfer(amount: string): this {
    return this.addActions([Actions.transfer({ amount })]);
  }

  get fungibleToken(): FungibleTokenFunctionCallWrapper {
    return new FungibleTokenFunctionCallWrapper(this);
  }

  get nonFungibleToken(): NonFubgibleTokenFunctionCallWrapper {
    return new NonFubgibleTokenFunctionCallWrapper(this);
  }

  get storageManagement(): StorageManagementFunctionCallWrapper {
    return new StorageManagementFunctionCallWrapper(this);
  }
}
