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
  EmptyObject,
} from '../types';
import { ActionFactory } from './ActionFactory';
import { Transaction, AccessKey, Action } from '../types';
import { Amount, Gas } from '../utils';
import { stringifyJsonOrBytes } from '../utils';
import { PublicKey } from 'near-api-js/lib/utils';

/**
 * Helper class for creating transaction(s) with builder pattern
 */
export class MultiTransaction {
  transactions: Transaction[];

  private constructor() {
    this.transactions = [];
  }

  /**
   * New 'MultiTransaction' object without transaction
   */
  static new(): MultiTransaction {
    return new MultiTransaction();
  }

  /**
   * New 'MultiTransaction' object with single transaction
   * @param receiverId transaction receiver id
   * @param signerId transaction signer id
   */
  static createTransaction(receiverId: string, signerId?: string): MultiTransaction {
    return MultiTransaction.new().appendTransaction(receiverId, signerId);
  }

  /**
   * current index
   * @private
   */
  private currentIndex(): number {
    return this.transactions.length - 1;
  }

  /**
   * If it has multiple transactions.
   */
  isMultiple(): boolean {
    return this.currentIndex() > 0;
  }

  /**
   * If it has only one transaction.
   */
  isSingle(): boolean {
    return this.currentIndex() === 0;
  }

  /**
   * If it has no transaction.
   */
  isEmpty(): boolean {
    return this.currentIndex() < 0;
  }

  /**
   * Count transaction
   */
  transactionCount(): number {
    return this.transactions.length;
  }

  /**
   * Count action of transaction
   * @param transactionIndex
   */
  actionCount(transactionIndex: number): number {
    if (transactionIndex > this.currentIndex()) {
      throw Error(`Wrong transaction index`);
    }
    return this.transactions[transactionIndex].actions.length;
  }

  /**
   * Count action of current transaction
   */
  currentActionCount(): number {
    return this.actionCount(this.currentIndex());
  }

  /**
   * Append a new transaction follow the previous transaction
   * @param receiverId transaction receiver id
   * @param signerId transaction signer id
   */
  appendTransaction(receiverId: string, signerId?: string): MultiTransaction {
    return this.addTransactions({ signerId, receiverId, actions: [] });
  }

  private addTransactions(...transactions: Transaction[]): MultiTransaction {
    this.transactions.push(...transactions);
    return this;
  }

  private addActions(...actions: Action[]): MultiTransaction {
    if (this.isEmpty()) {
      throw Error(`Transaction not found, consider calling method '.createTransaction(/* args */)' first`);
    }
    this.transactions[this.currentIndex()].actions.push(...actions);
    return this;
  }

  static fromTransactions(...transactions: Transaction[]): MultiTransaction {
    return MultiTransaction.new().addTransactions(...transactions);
  }

  toTransactions(): Transaction[] {
    return this.transactions;
  }

  extend(other: MultiTransaction) {
    this.addTransactions(...other.toTransactions());
  }

  // -------------------------------------------- Action ---------------------------------------------------
  /**
   * Add `CreateAccount` Action
   */
  createAccount(): MultiTransaction {
    return this.addActions(ActionFactory.createAccount());
  }

  /**
   * Add `DeleteAccount` Action
   * @param beneficiaryId beneficiary account id
   */
  deleteAccount(beneficiaryId: string): MultiTransaction {
    return this.addActions(ActionFactory.deleteAccount({ beneficiaryId }));
  }

  /**
   * Add `AddKey` Action
   * @param publicKey Public key
   * @param accessKey Public key info
   */
  addKey(publicKey: string, accessKey: AccessKey): MultiTransaction {
    return this.addActions(
      ActionFactory.addKey({
        publicKey: PublicKey.fromString(publicKey).toString(),
        accessKey,
      })
    );
  }

  /**
   * Add `DeleteKey` Action
   * @param publicKey Public key
   */
  deleteKey(publicKey: string): MultiTransaction {
    return this.addActions(ActionFactory.deleteKey({ publicKey: PublicKey.fromString(publicKey).toString() }));
  }

  /**
   * Add `DeployContract` Action
   * @param code Wasm code
   */
  deployContract(code: Uint8Array): MultiTransaction {
    return this.addActions(ActionFactory.deployContract({ code }));
  }

  /**
   * Add `Stake` Action
   * @param amount Staking amount
   * @param publicKey Staking public key
   */
  stake(amount: string, publicKey: string): MultiTransaction {
    return this.addActions(ActionFactory.stake({ amount, publicKey: PublicKey.fromString(publicKey).toString() }));
  }

  /**
   * Add `FunctionCall` Action
   * @param options FunctionCall options
   * @param options.methodName Method name
   * @param options.args `Uint8Array` or other type args, default `{}`
   * @param options.attachedDeposit Attached yocto NEAR amount. Default 0 yocto NEAR
   * @param options.gas Prepaid gas. Default 30 Tera
   * @param options.stringify Serialize args to bytes. Default will skip `Uint8Array` or serialize other type args in JSON format
   */
  functionCall<Args = EmptyObject>({
    methodName,
    args,
    attachedDeposit = Amount.ZERO,
    gas = Gas.DEFAULT,
    stringify = stringifyJsonOrBytes,
  }: FunctionCallOptions<Args>): MultiTransaction {
    return this.addActions(
      ActionFactory.functionCall({
        methodName,
        args: stringify(args ?? ({} as Args)),
        attachedDeposit,
        gas,
      })
    );
  }

  /**
   * Add `Transfer` Action
   * @param amount Transfer amount
   */
  transfer(amount: string): MultiTransaction {
    return this.addActions(ActionFactory.transfer({ amount }));
  }

  // --------------------------------------------- NEP145 --------------------------------------------------
  storage_deposit({ args, attachedDeposit, gas }: StorageDepositOptions): MultiTransaction {
    return this.functionCall<StorageDepositArgs>({
      methodName: 'storage_deposit',
      args,
      attachedDeposit,
      gas,
    });
  }

  storage_withdraw({ args, gas }: StorageWithdrawOptions): MultiTransaction {
    return this.functionCall<StorageWithdrawArgs>({
      methodName: 'storage_withdraw',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }

  storage_unregister({ args, gas }: StorageUnregisterOptions): MultiTransaction {
    return this.functionCall<StorageUnregisterArgs>({
      methodName: 'storage_unregister',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }

  // --------------------------------------------- NEP141 --------------------------------------------------
  ft_transfer({ args, gas }: FtTransferOptions): MultiTransaction {
    return this.functionCall<FtTransferArgs>({
      methodName: 'ft_transfer',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }

  ft_transfer_call({ args, gas }: FtTransferCallOptions): MultiTransaction {
    return this.functionCall<FtTransferCallArgs>({
      methodName: 'ft_transfer_call',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas: gas ?? Gas.tera(50),
    });
  }

  // --------------------------------------------- NEP171 --------------------------------------------------
  nft_transfer({ args, gas }: NftTransferOptions): MultiTransaction {
    return this.functionCall<NftTransferArgs>({
      methodName: 'nft_transfer',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }

  nft_transfer_call({ args, gas }: NftTransferCallOptions): MultiTransaction {
    return this.functionCall<NftTransferCallArgs>({
      methodName: 'nft_transfer_call',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas: gas ?? Gas.tera(50),
    });
  }

  nft_approve({ args, attachedDeposit, gas }: NftApproveOptions): MultiTransaction {
    return this.functionCall<NftApproveArgs>({
      methodName: 'nft_approve',
      args,
      attachedDeposit: attachedDeposit ?? Amount.parseYoctoNear('0.005'),
      gas,
    });
  }

  nft_revoke({ args, gas }: NftRevokeOptions): MultiTransaction {
    return this.functionCall<NftRevokeArgs>({
      methodName: 'nft_revoke',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }

  nft_revoke_all({ args, gas }: NftRevokeAllOptions): MultiTransaction {
    return this.functionCall<NftRevokeAllArgs>({
      methodName: 'nft_revoke_all',
      args,
      attachedDeposit: Amount.ONE_YOCTO,
      gas,
    });
  }
}
