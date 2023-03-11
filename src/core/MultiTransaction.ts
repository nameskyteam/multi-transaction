import {
  FtTransferArgs,
  FtTransferCallArgs,
  NftApproveArgs,
  NftRevokeAllArgs,
  NftRevokeArgs,
  NftTransferArgs,
  NftTransferCallArgs,
  Transaction,
  FunctionCallOptions,
  NearApiJsTransactionLike,
  NearWalletSelectorTransactionLike,
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
} from '../types';
import { ActionFactory } from './ActionFactory';
import { AccessKey, Action } from '../types';
import { parseNearApiJsTransaction, parseNearWalletSelectorTransaction } from '../utils';
import { Amount } from '../utils';
import { Gas } from '../utils';
import {stringifyJsonOrBytes} from "../utils/serialize";

/**
 * @description Helper class for creating transaction(s) with builder pattern
 *
 * @example
 * // Create an account for alice's honey and send some wNEAR
 * // to this account for a birthday gift
 * MultiTransaction
 *   // first transaction for creating account
 *   .createTransaction('honey.alice.near', 'alice.near')
 *   .createAccount()
 *   .transfer(Amount.parseYoctoNear('0.1'))
 *   .addKey('ed25519:this is a public key', { permission: 'FullAccess' })
 *   // second transaction for sending wNEAR
 *   .createTransaction('wrap.near')
 *   .storage_deposit({
 *     args: {
 *       account_id: 'honey.alice.near'
 *     },
 *     attachedDeposit: Amount.parseYoctoNear('0.00125')
 *   })
 *   .ft_transfer({
 *     args: {
 *       receiver_id: 'honey.alice.near',
 *       amount: Amount.parseYoctoNear('100'),
 *       memo: 'Happy Birthday'
 *     }
 *   })
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
    return MultiTransaction.new().createTransaction(receiverId, signerId);
  }

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
   * If it has no transaction.
   */
  isEmpty(): boolean {
    return this.currentIndex() === -1;
  }

  /**
   * Create a new transaction follow the previous transaction
   * @param receiverId transaction receiver id
   * @param signerId transaction signer id
   */
  createTransaction(receiverId: string, signerId?: string): MultiTransaction {
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
    this.addTransactions(...other.toTransactions())
  }

  // ------------------------------------------- Transform -------------------------------------------------
  /**
   * Transform to `near-api-js` like transactions
   * @example
   * const account = near.account('example.near')
   * for (transaction of multiTransaction.toNearApiJsTransactions()) {
   *   await account.signAndSendTransaction(transaction)
   * }
   */
  toNearApiJsTransactions(): NearApiJsTransactionLike[] {
    return this.toTransactions().map((transaction) => {
      return parseNearApiJsTransaction(transaction);
    });
  }

  /**
   * Transform to `wallet-selector` like transactions
   * @example
   * const wallet = await selector.wallet()
   * await wallet.signAndSendTransactions({
   *  transactions: multiTransaction.toNearWalletSelectorTransactions()
   * })
   */
  toNearWalletSelectorTransactions(): NearWalletSelectorTransactionLike[] {
    return this.toTransactions().map((transaction) => {
      return parseNearWalletSelectorTransaction(transaction);
    });
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
    return this.addActions(ActionFactory.addKey({ publicKey, accessKey }));
  }

  /**
   * Add `DeleteKey` Action
   * @param publicKey Public key
   */
  deleteKey(publicKey: string): MultiTransaction {
    return this.addActions(ActionFactory.deleteKey({ publicKey }));
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
    return this.addActions(ActionFactory.stake({ amount, publicKey }));
  }

  /**
   * Add `FunctionCall` Action
   * @param methodName Method name
   * @param args `Uint8Array` or other type args
   * @param attachedDeposit Attached yocto NEAR amount
   * @param gas Prepaid gas
   * @param stringify Serialize args to bytes. Default will skip `Uint8Array` or serialize other type args in JSON format
   */
  functionCall<Args>({
    methodName,
    args,
    attachedDeposit = Amount.ZERO,
    gas =  Gas.DEFAULT,
    stringify = stringifyJsonOrBytes
  }: FunctionCallOptions<Args>): MultiTransaction {
    return this.addActions(
      ActionFactory.functionCall({
        methodName,
        args: args ? stringify(args) : new Uint8Array(),
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
      attachedDeposit: attachedDeposit ?? Amount.ONE_YOCTO,
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
      attachedDeposit: attachedDeposit ?? Amount.ONE_YOCTO,
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
