import { Actions } from './Actions';
import { Transaction, AccessKey, Action } from '../../types';
import { Amount, Gas, Stringifier } from '../../utils';
import { PublicKey } from 'near-api-js/lib/utils';
import { FungibleTokenFunctionCall, StorageManagementFunctionCall, NonFungibleTokenFunctionCall } from './functioncall';

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
   * Merge other.
   * This requires that the other should contain ONLY one transaction and with the same receiver id & signer id as current transaction.
   * Actions will be merged into current transaction.
   * @param other Other
   */
  merge(other: MultiTransaction): this {
    const otherTransactions = other.toTransactions();

    if (otherTransactions.length === 0) {
      return this;
    }

    if (otherTransactions.length > 1) {
      throw Error('Merging multiple transactions is not allowed');
    }

    const otherTransaction = otherTransactions[0];
    const transaction = this.getCurrentTransaction();

    if (otherTransaction.receiverId !== transaction.receiverId) {
      throw Error('Merging transaction with different receiver id is not allowed');
    }

    if (otherTransaction.signerId !== transaction.signerId) {
      throw Error('Merging transaction with different signer id is not allowed');
    }

    return this.addActions(otherTransaction.actions);
  }

  /**
   * Extend other.
   * @param other Other
   */
  extend(other: MultiTransaction): this {
    return this.addTransactions(other.toTransactions());
  }

  /**
   * Whether it contains any transaction.
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
   * Count actions of current transaction.
   */
  countActions(): number {
    const transaction = this.getCurrentTransaction();
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
    const transaction = this.getCurrentTransaction();
    transaction.actions.push(...actions);
    return this;
  }

  private getCurrentTransaction(): Transaction {
    return this.transactions[this.transactions.length - 1];
  }

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

  transfer(amount: string): this {
    return this.addActions([Actions.transfer({ amount })]);
  }

  get ft(): FungibleTokenFunctionCall {
    return new FungibleTokenFunctionCall(this);
  }

  get nft(): NonFungibleTokenFunctionCall {
    return new NonFungibleTokenFunctionCall(this);
  }

  get storage(): StorageManagementFunctionCall {
    return new StorageManagementFunctionCall(this);
  }
}

export type FunctionCallOptions<Args> = {
  methodName: string;
  args?: Args;
  attachedDeposit?: string;
  gas?: string;
  stringifier?: Stringifier<Args>;
};

export type EmptyArgs = Record<string, never>;
