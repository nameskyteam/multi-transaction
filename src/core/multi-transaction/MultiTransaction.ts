import { FunctionCallOptions, EmptyArgs, MultiSend } from '../../types';
import { Actions } from './Actions';
import { Transaction, AccessKey, Action } from '../../types';
import { Amount, Gas } from '../../utils';
import { PublicKey } from 'near-api-js/lib/utils';
import { stringifyOrSkip } from '../../serde';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { Nep141Processor } from './Nep141Processor';
import { Nep145Processor } from './Nep145Processor';
import { Nep171Processor } from './Nep171Processor';

/**
 * Helper for creating transaction(s).
 */
export class MultiTransaction {
  private transactions: Transaction[];
  nep141: Nep141Processor;
  nep145: Nep145Processor;
  nep171: Nep171Processor;

  private constructor() {
    this.transactions = [];
    this.nep141 = new Nep141Processor(this);
    this.nep145 = new Nep145Processor(this);
    this.nep171 = new Nep171Processor(this);
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
    return this.addTransaction({ signerId, receiverId, actions: [] });
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

  /**
   * Add a transaction.
   * @param transaction Transaction
   */
  addTransaction(transaction: Transaction): this {
    this.transactions.push(transaction);
    return this;
  }

  /**
   * Add transactions.
   * @param transactions Transactions
   */
  addTransactions(transactions: Transaction[]): this {
    this.transactions.push(...transactions);
    return this;
  }

  /**
   * Add an action to the transaction.
   * @param action Action
   */
  addAction(action: Action): this {
    const transaction = this.getTheTransaction();
    transaction.actions.push(action);
    return this;
  }

  /**
   * Add actions to the transaction.
   * @param actions Actions
   */
  addActions(actions: Action[]): this {
    const transaction = this.getTheTransaction();
    transaction.actions.push(...actions);
    return this;
  }

  /**
   * Get the transaction.
   * @protected
   */
  protected getTheTransaction(): Transaction {
    return this.transactions[this.transactions.length - 1];
  }

  // -------------------------------------------- Send mTx -------------------------------------------------
  async send<Value>(sender: MultiSend): Promise<Value | void> {
    return sender.send(this);
  }

  async sendRaw(sender: MultiSend): Promise<FinalExecutionOutcome[] | void> {
    return sender.sendRaw(this);
  }

  // -------------------------------------------- Actions --------------------------------------------------
  createAccount(): this {
    return this.addAction(Actions.createAccount());
  }

  deleteAccount(beneficiaryId: string): this {
    return this.addAction(Actions.deleteAccount({ beneficiaryId }));
  }

  addKey(publicKey: string, accessKey: AccessKey): this {
    return this.addAction(
      Actions.addKey({
        publicKey: PublicKey.fromString(publicKey).toString(),
        accessKey,
      })
    );
  }

  deleteKey(publicKey: string): this {
    return this.addAction(Actions.deleteKey({ publicKey: PublicKey.fromString(publicKey).toString() }));
  }

  deployContract(code: Uint8Array): this {
    return this.addAction(Actions.deployContract({ code }));
  }

  stake(amount: string, publicKey: string): this {
    return this.addAction(Actions.stake({ amount, publicKey: PublicKey.fromString(publicKey).toString() }));
  }

  functionCall<Args = EmptyArgs>({
    methodName,
    args,
    attachedDeposit = Amount.ZERO,
    gas = Gas.DEFAULT,
    stringify = 'json',
  }: FunctionCallOptions<Args>): this {
    return this.addAction(
      Actions.functionCall({
        methodName,
        args: stringifyOrSkip(args ?? ({} as any), stringify),
        attachedDeposit,
        gas,
      })
    );
  }

  transfer(amount: string): this {
    return this.addAction(Actions.transfer({ amount }));
  }
}
