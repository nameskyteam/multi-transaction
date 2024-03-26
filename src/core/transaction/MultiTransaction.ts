import { Transaction, AccessKey, EmptyArgs } from '../../types';
import { MultiTransactionError } from '../../errors';
import { fungibleTokenFunctionCall, nonFungibleTokenFunctionCall, storageManagementFunctionCall } from '../../utils';
import {
  FunctionCallOptions,
  FungibleTokenFunctionCall,
  NonFungibleTokenFunctionCall,
  StorageManagementFunctionCall,
} from '../../types';
import { MultiAction } from './MultiAction';

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
    return this.getCurrentTransaction().mx;
  }

  private addTransactions(transactions: Transaction[]): this {
    const tx = transactions.map<TransactionWithMultiAction>(({ signerId, receiverId, actions }) => {
      return {
        signerId,
        receiverId,
        mx: MultiAction.fromActions(actions),
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
    const transactions = this.transactions.map<Transaction>(({ signerId, receiverId, mx }) => {
      return {
        signerId,
        receiverId,
        actions: mx.toActions(),
      };
    });
    return Array.from(transactions);
  }

  /**
   * Number of transactions.
   */
  numTransactions(): number {
    return this.transactions.length;
  }

  /**
   * Number of actions in current transaction.
   */
  numActions(): number {
    return this.getCurrentMultiAction().num();
  }

  /**
   * Extend transactions.
   */
  extendTransactions(mtx: MultiTransaction): this {
    const transactions = mtx.toTransactions();
    return this.addTransactions(transactions);
  }

  /**
   * Extend actions to current transaction.
   */
  extendActions(mx: MultiAction): this {
    this.getCurrentMultiAction().extend(mx);
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

type TransactionWithMultiAction = Pick<Transaction, 'signerId' | 'receiverId'> & {
  mx: MultiAction;
};

export type BatchOptions = Pick<Transaction, 'signerId' | 'receiverId'>;
