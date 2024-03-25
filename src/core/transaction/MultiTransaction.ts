import { Actions } from './Actions';
import { Transaction, AccessKey, Action } from '../../types';
import { Amount, Gas, Stringifier } from '../../utils';
import { PublicKey } from 'near-api-js/lib/utils';
import {
  FungibleTokenFunctionCall,
  StorageManagementFunctionCall,
  NonFungibleTokenFunctionCall,
} from './function-call';
import { MultiTransactionError } from '../../errors';

export class MultiTransaction {
  private readonly transactions: Transaction[];

  private constructor() {
    this.transactions = [];
  }

  /**
   * Create a new `MultiTransaction`.
   */
  static new(): MultiTransaction {
    return new MultiTransaction();
  }

  /**
   * Create a new `MultiTransaction` and add a transaction.
   * @param options options
   */
  static batch(options?: BatchOptions): MultiTransaction {
    return MultiTransaction.new().batch(options);
  }

  /**
   * Add a transaction following the previous one.
   * @param options options
   */
  batch(options?: BatchOptions): this {
    return this.addTransactions([{ signerId: options?.signerId, receiverId: options?.receiverId, actions: [] }]);
  }

  /**
   * Extend transactions.
   * @param mTx mTx
   */
  extendTransactions(mTx: MultiTransaction): this {
    return this.addTransactions(mTx.toTransactions());
  }

  /**
   * Extend actions to current transaction.
   * @param mTx mTx
   */
  extendActions(mTx: MultiTransaction): this {
    const otherTransactions = mTx.toTransactions();

    if (otherTransactions.length > 1) {
      throw new MultiTransactionError('Other `MultiTransaction` should contain up to one transaction');
    }

    if (otherTransactions.length === 0) {
      return this;
    }

    const otherTransaction = otherTransactions[0];
    const currentTransaction = this.getCurrentTransaction();

    if (otherTransaction.signerId && otherTransaction.signerId !== currentTransaction.signerId) {
      throw new MultiTransactionError('Other transaction should have the same `signerId` as current transaction');
    }

    if (otherTransaction.receiverId && otherTransaction.receiverId !== currentTransaction.receiverId) {
      throw new MultiTransactionError('Other transaction should have the same `receiverId` as current transaction');
    }

    return this.addActions(otherTransaction.actions);
  }

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
   * Count actions for current transaction.
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
    if (this.isEmpty()) {
      throw new MultiTransactionError('Transaction not found');
    }
    return this.transactions[this.transactions.length - 1];
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
  get ft(): FungibleTokenFunctionCall {
    return new FungibleTokenFunctionCall(this);
  }

  /**
   * NonFungibleToken Helper
   */
  get nft(): NonFungibleTokenFunctionCall {
    return new NonFungibleTokenFunctionCall(this);
  }

  /**
   * StorageManagement Helper
   */
  get storage(): StorageManagementFunctionCall {
    return new StorageManagementFunctionCall(this);
  }
}

export type BatchOptions = Pick<Transaction, 'signerId' | 'receiverId'>;

export type FunctionCallOptions<Args> = {
  methodName: string;
  args?: Args;
  attachedDeposit?: string;
  gas?: string;
  stringifier?: Stringifier<Args>;
};

export type EmptyArgs = Record<string, never>;
