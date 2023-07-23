import { BigNumber } from 'bignumber.js';

BigNumber.config({
  DECIMAL_PLACES: 100,
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
});

export * from './core';
export * from './types';
export * from './utils';
export * from './serde';
