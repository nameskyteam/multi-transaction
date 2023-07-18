import { Class } from '../../types';

/**
 * Type Mapping
 * * `Class<T>` -> `class`
 * * `string` -> `string`
 * * `u8`, `u16`, `u32` -> `number`
 * * `u64`, `u128`, `u256`, `u512` -> `bigint`
 * * `f32`, `f64` -> `number`
 * * `bool` -> `boolean`
 * * `BorshArrayU8` -> Fixed size `Buffer`
 * * `BorshArray` -> Fixed size `T[]`
 * * `BorshVecU8` -> `Buffer`
 * * `BorshVec` -> `T[]`
 * * `BorshOption` -> `T | undefined`
 */
export type BorshType =
  | Class<unknown>
  | 'string'
  | 'u8'
  | 'u16'
  | 'u32'
  | 'u64'
  | 'u128'
  | 'u256'
  | 'u512'
  | 'f32'
  | 'f64'
  | 'bool'
  | BorshArrayU8
  | BorshArray
  | BorshVecU8
  | BorshVec
  | BorshOption;

/**
 * BorshType. The mapped JavaScript type is `Buffer`. Fixed size.
 */
export class BorshArrayU8 {
  value = 'u8' as const;
  length: number;

  constructor(length: number) {
    this.length = length;
  }
}

/**
 * BorshType. The mapped JavaScript type is `T[]`. Fixed size.
 */
export class BorshArray {
  value: Exclude<BorshType, 'u8'>;
  length: number;

  constructor(value: Exclude<BorshType, 'u8'>, length: number) {
    this.value = value;
    this.length = length;
  }
}

/**
 * BorshType. The mapped JavaScript type is `Buffer`.
 */
export class BorshVecU8 {
  value = 'u8' as const;
}

/**
 * BorshType. The mapped JavaScript type is `T[]`.
 */
export class BorshVec {
  value: Exclude<BorshType, 'u8'>;

  constructor(value: Exclude<BorshType, 'u8'>) {
    this.value = value;
  }
}

/**
 * BorshType. The mapped JavaScript type is `T | undefined`.
 */
export class BorshOption {
  value: BorshType;

  constructor(value: BorshType) {
    this.value = value;
  }
}

/**
 * Create `BorshArrayU8`
 * @param type BorshType
 * @param length Array length
 */
export function array(type: 'u8', length: number): BorshArrayU8;
/**
 * Create `BorshArray`
 * @param type BorshType
 * @param length Array length
 */
export function array(type: BorshType, length: number): BorshArray;
export function array(type: BorshType, length: number): BorshArrayU8 | BorshArray {
  if (type === 'u8') {
    return new BorshArrayU8(length);
  } else {
    return new BorshArray(type, length);
  }
}

/**
 * Create `BorshVecU8`
 * @param type BorshType
 */
export function vec(type: 'u8'): BorshVecU8;
/**
 * Create `BorshVec`
 * @param type BorshType
 */
export function vec(type: BorshType): BorshVec;
export function vec(type: BorshType): BorshVecU8 | BorshVec {
  if (type === 'u8') {
    return new BorshVecU8();
  } else {
    return new BorshVec(type);
  }
}

/**
 * Create `BorshOption`
 * @param type BorshType
 */
export function option(type: BorshType): BorshOption {
  return new BorshOption(type);
}
