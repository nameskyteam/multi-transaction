import { Actions } from './Actions';
import { Transaction, AccessKey, Action } from '../../types';
import { Amount, Gas, Stringifier } from '../../utils';
import { PublicKey } from 'near-api-js/lib/utils';
import {
  FungibleTokenFunctionCall,
  StorageManagementFunctionCall,
  NonFungibleTokenFunctionCall,
} from './function-call';
import { MultiTransactionError } from '../../errors/MultiTransactionError';

export class MultiTransaction {
  private readonly transactions: Transaction[];

  private constructor() {
    this.transactions = [];
  }

  /**
   * Create an empty `MultiTransaction`.
   */
  static new(): MultiTransaction {
    return new MultiTransaction();
  }

  /**
   * Create a `MultiTransaction` that contains one transaction.
   * @param receiverId receiver id
   * @param signerId signer id
   */
  static batch(receiverId: string, signerId?: string): MultiTransaction {
    return MultiTransaction.new().batch(receiverId, signerId);
  }

  /**
   * Add a transaction following the previous one.
   * @param receiverId receiver id
   * @param signerId signer id
   */
  batch(receiverId: string, signerId?: string): this {
    return this.addTransactions([{ signerId, receiverId, actions: [] }]);
  }

  /**
   * Extend transactions.
   * @param mTx multi transaction
   */
  extendTransactions(mTx: MultiTransaction): this {
    return this.addTransactions(mTx.toTransactions());
  }

  /**
   * Extend actions.
   * This requires that the other `MultiTransaction` should contain ONLY one transaction and with the same `receiverId` & `signerId` as current transaction.
   * Actions will be merged into current transaction.
   * @param mTx multi transaction
   */
  extendActions(mTx: MultiTransaction): this {
    const otherTransactions = mTx.toTransactions();

    if (otherTransactions.length === 0) {
      return this;
    }

    if (otherTransactions.length > 1) {
      throw new MultiTransactionError('Other should contain ONLY one transaction');
    }

    const otherTransaction = otherTransactions[0];

    const transaction = this.getCurrentTransaction();

    if (otherTransaction.receiverId !== transaction.receiverId) {
      throw new MultiTransactionError('Other should contain the same `receiverId`');
    }

    if (otherTransaction.signerId !== transaction.signerId) {
      throw new MultiTransactionError('Other should contain the same `signerId`');
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
   * Count actions of CURRENT transaction.
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
   * Add a CreateAccount action into CURRENT transaction.
   */
  createAccount(): this {
    return this.addActions([Actions.createAccount()]);
  }

  /**
   * Add a DeleteAccount action into CURRENT transaction.
   * @param beneficiaryId beneficiary id
   */
  deleteAccount(beneficiaryId: string): this {
    return this.addActions([Actions.deleteAccount({ beneficiaryId })]);
  }

  /**
   * Add a AddKey action into CURRENT transaction.
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
   * Add a DeleteKey action into CURRENT transaction.
   * @param publicKey public key
   */
  deleteKey(publicKey: string): this {
    return this.addActions([Actions.deleteKey({ publicKey: PublicKey.fromString(publicKey).toString() })]);
  }

  /**
   * Add a DeployContract action into CURRENT transaction.
   * @param code code
   */
  deployContract(code: Uint8Array): this {
    return this.addActions([Actions.deployContract({ code })]);
  }

  /**
   * Add a Stake action into CURRENT transaction.
   * @param amount amount
   * @param publicKey public key
   */
  stake(amount: string, publicKey: string): this {
    return this.addActions([Actions.stake({ amount, publicKey: PublicKey.fromString(publicKey).toString() })]);
  }

  /**
   * Add a FunctionCall action into CURRENT transaction.
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
   * Add a Transfer action into CURRENT transaction.
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

export type FunctionCallOptions<Args> = {
  methodName: string;
  args?: Args;
  attachedDeposit?: string;
  gas?: string;
  stringifier?: Stringifier<Args>;
};

export type EmptyArgs = Record<string, never>;
