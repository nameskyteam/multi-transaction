import { Actions } from './Actions';
import { Transaction, AccessKey, Action, MultiAction, EmptyArgs, FunctionCallOptions } from '../../types';
import { Amount, Gas, Stringifier } from '../../utils';
import { PublicKey } from 'near-api-js/lib/utils';
import {
  FungibleTokenFunctionCall,
  StorageManagementFunctionCall,
  NonFungibleTokenFunctionCall,
} from './function-call';
import { MultiTransactionError } from '../../errors';
import { Optional } from '../../types';

export class MultiTransaction implements MultiAction {
  private readonly transactions: MaybeIncompleteTransaction[];

  private constructor() {
    this.transactions = [];
  }

  private getCurrentTransaction(): MaybeIncompleteTransaction {
    if (this.isEmpty()) {
      throw new MultiTransactionError('Transaction not found');
    }
    return this.transactions[this.transactions.length - 1];
  }

  private addTransactions(transactions: MaybeIncompleteTransaction[]): this {
    this.transactions.push(...transactions);
    return this;
  }

  private addActions(actions: Action[]): this {
    const transaction = this.getCurrentTransaction();
    transaction.actions.push(...actions);
    return this;
  }

  private assertCompleteTransactions(): Transaction[] {
    this.transactions.forEach((transaction, index) => {
      if (!transaction.receiverId) {
        throw new MultiTransactionError(`Transaction (${index}) missing \`receiverId\``);
      }
    });
    return this.transactions as Transaction[];
  }

  /**
   * If it is empty.
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
   * Count actions for current transaction.
   */
  countActions(): number {
    const transaction = this.getCurrentTransaction();
    return transaction.actions.length;
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
  extendActions(mTx: MultiAction): this {
    const otherTransactions = mTx.toTransactions();

    if (otherTransactions.length > 1) {
      throw new MultiTransactionError('`MultiAction` should contain up to one transaction');
    }

    if (otherTransactions.length === 0) {
      return this;
    }

    return this.addActions(otherTransactions[0].actions);
  }

  /**
   * Create a new `MultiTransaction` from transactions.
   * @param transactions
   */
  static fromTransactions(transactions: Transaction[]): MultiTransaction {
    return MultiTransaction.new().addTransactions(transactions);
  }

  /**
   * Return transactions.
   */
  toTransactions(): Transaction[] {
    const transactions = this.assertCompleteTransactions();
    return Array.from(transactions);
  }

  /**
   * Return actions of current transaction.
   */
  toActions(): Action[] {
    const transaction = this.getCurrentTransaction();
    return Array.from(transaction.actions);
  }

  /**
   * Create a new `MultiTransaction`.
   */
  static new(): MultiTransaction {
    return new MultiTransaction();
  }

  /**
   * Create a new `MultiAction`.
   */
  static actions(): MultiAction {
    return MultiTransaction.new().addTransactions([{ actions: [] }]);
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
}

type MaybeIncompleteTransaction = Optional<Transaction, 'receiverId'>;

export type BatchOptions = Pick<Transaction, 'signerId' | 'receiverId'>;
