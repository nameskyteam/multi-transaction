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
} from '../types';
import { Actions } from './Actions';
import { Transaction, AccessKey, Action } from '../types';
import { Amount, Gas } from '../utils';
import { PublicKey } from 'near-api-js/lib/utils';
import { stringifyOrSkip } from '../serde';

/**
 * Helper class for creating transaction(s) with builder pattern
 */
export class MultiTransaction {
  transactions: Transaction[];

  private constructor() {
    this.transactions = [];
  }

  static new(): MultiTransaction {
    return new MultiTransaction();
  }

  /**
   * @param receiverId transaction receiver id
   * @param signerId transaction signer id
   */
  static batch(receiverId: string, signerId?: string): MultiTransaction {
    return MultiTransaction.new().batch(receiverId, signerId);
  }

  /**
   * current transaction index
   * @private
   */
  private currentTransactionIndex(): number {
    return this.transactions.length - 1;
  }

  /**
   * If it contains no transaction.
   */
  isEmpty(): boolean {
    return this.currentTransactionIndex() < 0;
  }

  /**
   * Count transactions
   */
  transactionCount(): number {
    return this.transactions.length;
  }

  /**
   * Count actions of transaction
   * @param transactionIndex
   */
  actionCount(transactionIndex?: number): number {
    transactionIndex = transactionIndex ?? this.currentTransactionIndex();
    if (transactionIndex > this.currentTransactionIndex()) {
      throw Error(`Transaction index out of bound.`);
    }
    return this.transactions[transactionIndex].actions.length;
  }

  /**
   * @param receiverId transaction receiver id
   * @param signerId transaction signer id
   */
  batch(receiverId: string, signerId?: string): MultiTransaction {
    return this.addTransactions({ signerId, receiverId, actions: [] });
  }

  private addTransactions(...transactions: Transaction[]): MultiTransaction {
    this.transactions.push(...transactions);
    return this;
  }

  private addActions(...actions: Action[]): MultiTransaction {
    if (this.isEmpty()) {
      throw Error(`Transaction not found, consider calling method '.batch(...)' first.`);
    }
    this.transactions[this.currentTransactionIndex()].actions.push(...actions);
    return this;
  }

  static fromTransactions(...transactions: Transaction[]): MultiTransaction {
    return MultiTransaction.new().addTransactions(...transactions);
  }

  toTransactions(): Transaction[] {
    return this.transactions;
  }

  extend(other: MultiTransaction): MultiTransaction {
    return this.addTransactions(...other.toTransactions());
  }

  // -------------------------------------------- Action ---------------------------------------------------
  /**
   * Add `CreateAccount` Action
   */
  createAccount(): MultiTransaction {
    return this.addActions(Actions.createAccount());
  }

  /**
   * Add `DeleteAccount` Action
   * @param beneficiaryId beneficiary account id
   */
  deleteAccount(beneficiaryId: string): MultiTransaction {
    return this.addActions(Actions.deleteAccount({ beneficiaryId }));
  }

  /**
   * Add `AddKey` Action
   * @param publicKey Public key
   * @param accessKey Public key info
   */
  addKey(publicKey: string, accessKey: AccessKey): MultiTransaction {
    return this.addActions(
      Actions.addKey({
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
    return this.addActions(Actions.deleteKey({ publicKey: PublicKey.fromString(publicKey).toString() }));
  }

  /**
   * Add `DeployContract` Action
   * @param code Wasm code
   */
  deployContract(code: Uint8Array): MultiTransaction {
    return this.addActions(Actions.deployContract({ code }));
  }

  /**
   * Add `Stake` Action
   * @param amount Staking amount
   * @param publicKey Staking public key
   */
  stake(amount: string, publicKey: string): MultiTransaction {
    return this.addActions(Actions.stake({ amount, publicKey: PublicKey.fromString(publicKey).toString() }));
  }

  /**
   * Add `FunctionCall` Action
   */
  functionCall<Args = EmptyArgs>({
    methodName,
    args,
    attachedDeposit = Amount.ZERO,
    gas = Gas.DEFAULT,
    stringify = 'json',
  }: FunctionCallOptions<Args>): MultiTransaction {
    return this.addActions(
      Actions.functionCall({
        methodName,
        args: stringifyOrSkip(args ?? ({} as any), stringify),
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
    return this.addActions(Actions.transfer({ amount }));
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
