import { Transaction, AccessKey, MultiAction, EmptyArgs, FunctionCallOptions } from '../../types';
import {
  FungibleTokenFunctionCall,
  StorageManagementFunctionCall,
  NonFungibleTokenFunctionCall,
} from './function-call';
import { MultiTransactionError } from '../../errors';

export class MultiTransaction {
  private readonly transactions: TransactionWithMultiAction[];

  private constructor() {
    this.transactions = [];
  }

  private getCurrentTransaction(): TransactionWithMultiAction {
    if (this.transactions.length === 0) {
      throw new MultiTransactionError('Transaction not found');
    }
    return this.transactions[this.transactions.length - 1];
  }

  private getCurrentMultiAction(): MultiAction {
    return this.getCurrentTransaction().mAc;
  }

  private addTransactions(transactions: Transaction[]): this {
    const tx = transactions.map<TransactionWithMultiAction>(({ signerId, receiverId, actions }) => {
      return {
        signerId,
        receiverId,
        mAc: MultiAction.fromActions(actions),
      };
    });
    this.transactions.push(...tx);
    return this;
  }

  /**
   * Create a new `MultiTransaction` from transactions.
   */
  static fromTransactions(transactions: Transaction[]): MultiTransaction {
    return MultiTransaction.new().addTransactions(transactions);
  }

  /**
   * Return transactions.
   */
  toTransactions(): Transaction[] {
    const transactions = this.transactions.map<Transaction>(({ signerId, receiverId, mAc }) => {
      return {
        signerId,
        receiverId,
        actions: mAc.toActions(),
      };
    });
    return Array.from(transactions);
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
  countCurrentActions(): number {
    return this.getCurrentMultiAction().countActions();
  }

  /**
   * Extend transactions.
   */
  extendTransactions(mTx: MultiTransaction): this {
    const transactions = mTx.toTransactions();
    return this.addTransactions(transactions);
  }

  /**
   * Extend actions to current transaction.
   */
  extendCurrentActions(mAc: MultiAction): this {
    this.getCurrentMultiAction().extendActions(mAc);
    return this;
  }

  /**
   * Create a new `MultiTransaction`.
   */
  static new(): MultiTransaction {
    return new MultiTransaction();
  }

  /**
   * Create a new `MultiTransaction` and add a transaction.
   */
  static batch(options: BatchOptions): MultiTransaction {
    return MultiTransaction.new().batch(options);
  }

  /**
   * Add a transaction following the previous one.
   */
  batch({ signerId, receiverId }: BatchOptions): this {
    return this.addTransactions([{ signerId, receiverId, actions: [] }]);
  }

  /**
   * Add a CreateAccount Action following the previous one.
   */
  createAccount(): this {
    this.getCurrentMultiAction().createAccount();
    return this;
  }

  /**
   * Add a DeleteAccount Action following the previous one.
   */
  deleteAccount(beneficiaryId: string): this {
    this.getCurrentMultiAction().deleteAccount(beneficiaryId);
    return this;
  }

  /**
   * Add a AddKey Action following the previous one.
   */
  addKey(publicKey: string, accessKey: AccessKey): this {
    this.getCurrentMultiAction().addKey(publicKey, accessKey);
    return this;
  }

  /**
   * Add a DeleteKey Action following the previous one.
   */
  deleteKey(publicKey: string): this {
    this.getCurrentMultiAction().deleteKey(publicKey);
    return this;
  }

  /**
   * Add a DeployContract Action following the previous one.
   */
  deployContract(code: Uint8Array): this {
    this.getCurrentMultiAction().deployContract(code);
    return this;
  }

  /**
   * Add a Stake Action following the previous one.
   */
  stake(amount: string, publicKey: string): this {
    this.getCurrentMultiAction().stake(amount, publicKey);
    return this;
  }

  /**
   * Add a FunctionCall Action following the previous one.
   */
  functionCall<Args = EmptyArgs>(options: FunctionCallOptions<Args>): this {
    this.getCurrentMultiAction().functionCall(options);
    return this;
  }

  /**
   * Add a Transfer Action following the previous one.
   */
  transfer(amount: string): this {
    this.getCurrentMultiAction().transfer(amount);
    return this;
  }

  /**
   * FungibleToken.
   */
  get ft(): FungibleTokenFunctionCall<this> {
    return new FungibleTokenFunctionCall(this);
  }

  /**
   * NonFungibleToken.
   */
  get nft(): NonFungibleTokenFunctionCall<this> {
    return new NonFungibleTokenFunctionCall(this);
  }

  /**
   * StorageManagement.
   */
  get storage(): StorageManagementFunctionCall<this> {
    return new StorageManagementFunctionCall(this);
  }
}

type TransactionWithMultiAction = Pick<Transaction, 'signerId' | 'receiverId'> & {
  mAc: MultiAction;
};

export type BatchOptions = Pick<Transaction, 'signerId' | 'receiverId'>;
