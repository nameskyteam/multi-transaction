import { BigNumber } from 'bignumber.js';

BigNumber.config({
  DECIMAL_PLACES: 100,
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
});

export { MultiTransaction, MultiAction } from './core';

export {
  BlockQuery,
  BlockQueryProvider,
  BlockWithHeader,
  Stringifier,
  Parser,
  parseFinalExecutionOutcomeValue,
  throwReceiptErrorsFromFinalExecutionOutcomes,
} from './utils';

export { Units, Amount, AmountUnits, Gas, GasUnits } from './utils';

export {
  JsonArgs,
  Send,
  SendOptions,
  SendRawOptions,
  Call,
  CallOptions,
  CallRawOptions,
  View,
  ViewOptions,
  ViewRawOptions,
} from './types';

export {
  Transaction,
  Action,
  AccessKey,
  GlobalContractDeployMode,
  GlobalContractIdentifier,
} from './types';

export {
  FtTransferArgs,
  FtTransferCallArgs,
  FtBalanceOfArgs,
  FungibleTokenMetadata,
} from './types';

export {
  NftTransferArgs,
  NftTransferCallArgs,
  NftTokenArgs,
  NftApproveArgs,
  NftRevokeArgs,
  NftRevokeAllArgs,
  NftIsApprovedArgs,
  NftTokensArgs,
  NftSupplyForOwnerArgs,
  NftTokensForOwnerArgs,
  Token,
  TokenMetadata,
  NFTContractMetadata,
} from './types';

export {
  StorageDepositArgs,
  StorageWithdrawArgs,
  StorageUnregisterArgs,
  StorageBalanceOfArgs,
  StorageBalance,
  StorageBalanceBounds,
} from './types';

export { SendTransactionError, UnreachableError } from './errors';

export { BigNumber } from 'bignumber.js';

export {
  borshSerialize,
  borshDeserialize,
  BorshSchema,
  Unit,
  Infer,
} from 'borsher';
