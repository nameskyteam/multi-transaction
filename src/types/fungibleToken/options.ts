import { FtTransferArgs, FtTransferCallArgs } from './args';
import { CamelCaseKeys } from 'camelcase-keys';

export interface FtTransferOptions {
  args: CamelCaseKeys<FtTransferArgs>;
  gas?: string;
}

export interface FtTransferCallOptions {
  args: CamelCaseKeys<FtTransferCallArgs>;
  gas?: string;
}
