import {
  FtTransferArgs,
  FtTransferCallArgs,
  NftApproveArgs,
  NftRevokeAllArgs,
  NftRevokeArgs,
  NftTransferArgs,
  NftTransferCallArgs,
  FunctionCallOptions,
  StorageDepositOptions,
  StorageWithdrawOptions,
  StorageUnregisterOptions,
  FtTransferOptions,
  FtTransferCallOptions,
  StorageDepositArgs,
  StorageWithdrawArgs,
  StorageUnregisterArgs,
  NftTransferOptions,
  NftTransferCallOptions,
  NftApproveOptions,
  NftRevokeOptions,
  NftRevokeAllOptions,
  EmptyArgs,
  MultiSend,
} from '../types';
import { Actions } from './Actions';
import { Transaction, AccessKey, Action } from '../types';
import { Amount, Gas } from '../utils';
import { PublicKey } from 'near-api-js/lib/utils';
import { stringifyOrSkip } from '../serde';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';

/**
 * Helper for creating transaction(s).
 */
export class MultiTransaction {
  protected transactions: Transaction[];

  protected constructor() {
    this.transactions = [];
  }

  /**
   * Create an instance that contains no transaction.
   */
  static new() {
    return new this();
  }

  /**
   * Create a transaction.
   * @param receiverId Transaction receiver id
   * @param signerId Transaction signer id
   */
  static batch(receiverId: string, signerId?: string) {
    return this.new().batch(receiverId, signerId);
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

  static fromTransactions(transactions: Transaction[]) {
    return this.new().addTransactions(transactions);
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
  async send<Value>(sender: MultiSend): Promise<Value | undefined> {
    return sender.send(this);
  }

  async sendRaw(sender: MultiSend): Promise<FinalExecutionOutcome[] | undefined> {
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

  // --------------------------------------------- NEP145 --------------------------------------------------
  storage_deposit({ args, attachedDeposit, gas }: StorageDepositOptions): this {
    return this.functionCall<StorageDepositArgs>({
      methodName: 'storage_deposit',
      args,
      attachedDeposit,
      gas,
    });
  }

  storage_withdraw({ args, gas }: StorageWithdrawOptions): this {
    return this.functionCall<StorageWithdrawArgs>({
      methodName: 'storage_withdraw',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }

  storage_unregister({ args, gas }: StorageUnregisterOptions): this {
    return this.functionCall<StorageUnregisterArgs>({
      methodName: 'storage_unregister',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }

  // --------------------------------------------- NEP141 --------------------------------------------------
  ft_transfer({ args, gas }: FtTransferOptions): this {
    return this.functionCall<FtTransferArgs>({
      methodName: 'ft_transfer',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }

  ft_transfer_call({ args, gas }: FtTransferCallOptions): this {
    return this.functionCall<FtTransferCallArgs>({
      methodName: 'ft_transfer_call',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas: gas ?? Gas.tera(50),
    });
  }

  // --------------------------------------------- NEP171 --------------------------------------------------
  nft_transfer({ args, gas }: NftTransferOptions): this {
    return this.functionCall<NftTransferArgs>({
      methodName: 'nft_transfer',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }

  nft_transfer_call({ args, gas }: NftTransferCallOptions): this {
    return this.functionCall<NftTransferCallArgs>({
      methodName: 'nft_transfer_call',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas: gas ?? Gas.tera(50),
    });
  }

  nft_approve({ args, attachedDeposit, gas }: NftApproveOptions): this {
    return this.functionCall<NftApproveArgs>({
      methodName: 'nft_approve',
      args,
      attachedDeposit: attachedDeposit ?? Amount.parseYoctoNear('0.005'),
      gas,
    });
  }

  nft_revoke({ args, gas }: NftRevokeOptions): this {
    return this.functionCall<NftRevokeArgs>({
      methodName: 'nft_revoke',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }

  nft_revoke_all({ args, gas }: NftRevokeAllOptions): this {
    return this.functionCall<NftRevokeAllArgs>({
      methodName: 'nft_revoke_all',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }
}
