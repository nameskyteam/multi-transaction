import { BigNumber } from 'bignumber.js';
import { CamelCaseKeys } from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

BigNumber.config({
  DECIMAL_PLACES: 100,
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
});

export * from './core';
export * from './types';
export * from './utils';
export { borshSerialize, borshDeserialize, BorshSchema, EnumVariants, StructFields } from 'borsher';
export { BigNumber, CamelCaseKeys, snakecaseKeys };
