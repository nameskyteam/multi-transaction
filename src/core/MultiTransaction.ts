import { MultiTransactionError } from '../errors';
import { fungibleTokenFunctionCall, nonFungibleTokenFunctionCall, storageManagementFunctionCall } from '../utils';
import {
  EmptyArgs,
  AccessKey,
  Transaction,
  FunctionCallOptions,
  FungibleTokenFunctionCall,
  NonFungibleTokenFunctionCall,
  StorageManagementFunctionCall,
} from '../types';
import { MultiAction } from './MultiAction';

export class MultiTransaction {
  private readonly transactions: LocalTransaction[];

  private constructor() {
    this.transactions = [];
  }

  private get tx(): LocalTransaction {
    if (this.transactions.length === 0) {
      throw new MultiTransactionError('Transaction not found');
    }
    return this.transactions[this.transactions.length - 1];
  }

  private addTransactions(transactions: LocalTransaction[]): this {
    this.transactions.push(...transactions);
    return this;
  }

  static fromTransactions(transactions: Transaction[]): MultiTransaction {
    return MultiTransaction.new().addTransactions(convertTransactionsToLocalTransactions(transactions));
  }

  toTransactions(): Transaction[] {
    return Array.from(convertLocalTransactionsToTransactions(this.transactions));
  }

  extend(mtx: MultiTransaction): this {
    return this.addTransactions(mtx.transactions);
  }

  /**
   * Create a new `MultiTransaction` instance
   */
  static new(): MultiTransaction {
    return new MultiTransaction();
  }

  /**
   * Create a new `MultiTransaction` instance and add a transaction
   */
  static batch(options: BatchOptions): MultiTransaction {
    return MultiTransaction.new().batch(options);
  }

  /**
   * Add a transaction following previous transactions
   */
  batch({ signerId, receiverId }: BatchOptions): this {
    return this.addTransactions([{ signerId, receiverId, mx: MultiAction.new() }]);
  }

  /**
   * Add all actions following previous actions
   */
  actions(mx: MultiAction): this {
    this.tx.mx.extend(mx);
    return this;
  }

  /**
   * Add a CreateAccount Action following previous actions
   */
  createAccount(): this {
    this.tx.mx.createAccount();
    return this;
  }

  /**
   * Add a DeleteAccount Action following previous actions
   */
  deleteAccount(beneficiaryId: string): this {
    this.tx.mx.deleteAccount(beneficiaryId);
    return this;
  }

  /**
   * Add a AddKey Action following previous actions
   */
  addKey(publicKey: string, accessKey: AccessKey): this {
    this.tx.mx.addKey(publicKey, accessKey);
    return this;
  }

  /**
   * Add a DeleteKey Action following previous actions
   */
  deleteKey(publicKey: string): this {
    this.tx.mx.deleteKey(publicKey);
    return this;
  }

  /**
   * Add a DeployContract Action following previous actions
   */
  deployContract(code: Uint8Array): this {
    this.tx.mx.deployContract(code);
    return this;
  }

  /**
   * Add a Stake Action following previous actions
   */
  stake(amount: string, publicKey: string): this {
    this.tx.mx.stake(amount, publicKey);
    return this;
  }

  /**
   * Add a FunctionCall Action following previous actions
   */
  functionCall<Args = EmptyArgs>(options: FunctionCallOptions<Args>): this {
    this.tx.mx.functionCall(options);
    return this;
  }

  /**
   * Add a Transfer Action following previous actions
   */
  transfer(amount: string): this {
    this.tx.mx.transfer(amount);
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

function convertTransactionsToLocalTransactions(transactions: Transaction[]): LocalTransaction[] {
  return transactions.map(({ signerId, receiverId, actions }) => ({
    signerId,
    receiverId,
    mx: MultiAction.fromActions(actions),
  }));
}

function convertLocalTransactionsToTransactions(transactions: LocalTransaction[]): Transaction[] {
  return transactions.map(({ signerId, receiverId, mx }) => ({
    signerId,
    receiverId,
    actions: mx.toActions(),
  }));
}

type LocalTransaction = Omit<Transaction, 'actions'> & {
  mx: MultiAction;
};

export type BatchOptions = Pick<Transaction, 'signerId' | 'receiverId'>;
