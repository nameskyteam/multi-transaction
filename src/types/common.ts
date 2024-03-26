import { BigNumber } from 'bignumber.js';

export type EmptyArgs = Record<string, never>;

export type Numeric = BigNumber | string | number;
