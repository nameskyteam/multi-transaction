import { BigNumber } from 'bignumber.js';

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type EmptyArgs = Record<string, never>;

export type BigNumberLike = BigNumber | string | number;
