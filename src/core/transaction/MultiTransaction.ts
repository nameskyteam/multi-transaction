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

  private addTransactions(transactions: TransactionWithMultiAction[]): this {
    this.transactions.push(...transactions);
    return this;
  }

  private assertCompleteTransactions() {
    this.transactions.forEach((transaction, index) => {
      if (!transaction.receiverId) {
        throw new MultiTransactionError(`Transaction (${index}) missing \`receiverId\``);
      }
    });
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
    return this.addTransactions([{ signerId, receiverId, mAc: MultiAction.new() }]);
  }

  /**
   * Add a CreateAccount Action following the previous one.
   */
  createAccount(): this {
    const transaction = this.getCurrentTransaction();
    transaction.mAc.createAccount();
    return this;
  }

  /**
   * Add a DeleteAccount Action following the previous one.
   * @param beneficiaryId beneficiary id
   */
  deleteAccount(beneficiaryId: string): this {
    const transaction = this.getCurrentTransaction();
    transaction.mAc.deleteAccount(beneficiaryId);
    return this;
  }

  /**
   * Add a AddKey Action following the previous one.
   * @param publicKey public key
   * @param accessKey access key
   */
  addKey(publicKey: string, accessKey: AccessKey): this {
    const transaction = this.getCurrentTransaction();
    transaction.mAc.addKey(publicKey, accessKey);
    return this;
  }

  /**
   * Add a DeleteKey Action following the previous one.
   * @param publicKey public key
   */
  deleteKey(publicKey: string): this {
    const transaction = this.getCurrentTransaction();
    transaction.mAc.deleteKey(publicKey);
    return this;
  }

  /**
   * Add a DeployContract Action following the previous one.
   * @param code code
   */
  deployContract(code: Uint8Array): this {
    const transaction = this.getCurrentTransaction();
    transaction.mAc.deployContract(code);
    return this;
  }

  /**
   * Add a Stake Action following the previous one.
   * @param amount amount
   * @param publicKey public key
   */
  stake(amount: string, publicKey: string): this {
    const transaction = this.getCurrentTransaction();
    transaction.mAc.stake(amount, publicKey);
    return this;
  }

  /**
   * Add a FunctionCall Action following the previous one.
   */
  functionCall<Args = EmptyArgs>(options: FunctionCallOptions<Args>): this {
    const transaction = this.getCurrentTransaction();
    transaction.mAc.functionCall(options);
    return this;
  }

  /**
   * Add a Transfer Action following the previous one.
   * @param amount amount
   */
  transfer(amount: string): this {
    const transaction = this.getCurrentTransaction();
    transaction.mAc.transfer(amount);
    return this;
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

  /**
   * Extend transactions.
   * @param mTx mTx
   */
  extendTransactions(mTx: MultiTransaction): this {
    const transactions = mTx.toTransactions().map<TransactionWithMultiAction>(({ signerId, receiverId, actions }) => {
      return {
        signerId,
        receiverId,
        mAc: MultiAction.fromActions(actions),
      };
    });
    return this.addTransactions(transactions);
  }

  /**
   * Extend actions to current transaction.
   * @param mAc mAc
   */
  extendActions(mAc: MultiAction): this {
    const actions = mAc.toActions();
    const transaction = this.getCurrentTransaction();
    transaction.mAc.addActions(actions);
    return this;
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
    return transaction.mAc.countActions();
  }

  /**
   * Create a new `MultiTransaction` from transactions.
   * @param transactions
   */
  static fromTransactions(transactions: Transaction[]): MultiTransaction {
    const tx = transactions.map<TransactionWithMultiAction>(({ signerId, receiverId, actions }) => {
      return {
        signerId,
        receiverId,
        mAc: MultiAction.fromActions(actions),
      };
    });
    return MultiTransaction.new().addTransactions(tx);
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
}

type TransactionWithMultiAction = Pick<Transaction, 'signerId' | 'receiverId'> & {
  mAc: MultiAction;
};

export type BatchOptions = Pick<Transaction, 'signerId' | 'receiverId'>;
