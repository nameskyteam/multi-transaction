import { FtTransferArgs, FtTransferCallArgs } from './args';
import { CamelCaseKeys } from 'camelcase-keys';

export type FtTransferOptions = {
  args: CamelCaseKeys<FtTransferArgs>;
  gas?: string;
};

export type FtTransferCallOptions = {
  args: CamelCaseKeys<FtTransferCallArgs>;
  gas?: string;
};
