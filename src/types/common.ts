import { BigNumber } from 'bignumber.js';

export type EmptyArgs = Record<string, never>;

export type BigNumberLike = BigNumber | string | number;
