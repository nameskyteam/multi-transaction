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
  private readonly transactions: InternalTransaction[];

  private constructor() {
    this.transactions = [];
  }

  private get transaction(): InternalTransaction {
    if (this.transactions.length === 0) {
      throw new MultiTransactionError('Transaction not found');
    }
    return this.transactions[this.transactions.length - 1];
  }

  private addTransactions(transactions: InternalTransaction[]): this {
    this.transactions.push(...transactions);
    return this;
  }

  static fromTransactions(transactions: Transaction[]): MultiTransaction {
    return MultiTransaction.new().addTransactions(fromTransactions(transactions));
  }

  toTransactions(): Transaction[] {
    return toTransactions(this.transactions);
  }

  extend(mTransaction: MultiTransaction): this {
    return this.addTransactions(mTransaction.transactions);
  }

  static new(): MultiTransaction {
    return new MultiTransaction();
  }

  /**
   * Create a transaction
   */
  static batch(options: BatchOptions): MultiTransaction {
    return MultiTransaction.new().batch(options);
  }

  /**
   * Add a transaction following previous transactions
   */
  batch({ signerId, receiverId }: BatchOptions): this {
    return this.addTransactions([{ signerId, receiverId, mAction: MultiAction.new() }]);
  }

  /**
   * Add actions following previous actions
   */
  addMultiAction(mAction: MultiAction): this {
    this.transaction.mAction.extend(mAction);
    return this;
  }

  /**
   * Add a CreateAccount Action following previous actions
   */
  createAccount(): this {
    this.transaction.mAction.createAccount();
    return this;
  }

  /**
   * Add a DeleteAccount Action following previous actions
   */
  deleteAccount(beneficiaryId: string): this {
    this.transaction.mAction.deleteAccount(beneficiaryId);
    return this;
  }

  /**
   * Add a AddKey Action following previous actions
   */
  addKey(publicKey: string, accessKey: AccessKey): this {
    this.transaction.mAction.addKey(publicKey, accessKey);
    return this;
  }

  /**
   * Add a DeleteKey Action following previous actions
   */
  deleteKey(publicKey: string): this {
    this.transaction.mAction.deleteKey(publicKey);
    return this;
  }

  /**
   * Add a DeployContract Action following previous actions
   */
  deployContract(code: Uint8Array): this {
    this.transaction.mAction.deployContract(code);
    return this;
  }

  /**
   * Add a Stake Action following previous actions
   */
  stake(amount: string, publicKey: string): this {
    this.transaction.mAction.stake(amount, publicKey);
    return this;
  }

  /**
   * Add a FunctionCall Action following previous actions
   */
  functionCall<Args = EmptyArgs>(options: FunctionCallOptions<Args>): this {
    this.transaction.mAction.functionCall(options);
    return this;
  }

  /**
   * Add a Transfer Action following previous actions
   */
  transfer(amount: string): this {
    this.transaction.mAction.transfer(amount);
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

function fromTransactions(transactions: Transaction[]): InternalTransaction[] {
  return transactions.map(({ signerId, receiverId, actions }) => ({
    signerId,
    receiverId,
    mAction: MultiAction.fromActions(actions),
  }));
}

function toTransactions(transactions: InternalTransaction[]): Transaction[] {
  return transactions.map(({ signerId, receiverId, mAction }) => ({
    signerId,
    receiverId,
    actions: mAction.toActions(),
  }));
}

type InternalTransaction = Omit<Transaction, 'actions'> & {
  mAction: MultiAction;
};

export type BatchOptions = Pick<Transaction, 'signerId' | 'receiverId'>;
