import { BlockReference } from 'near-api-js/lib/providers/provider';
import { Provider } from 'near-api-js/lib/providers';
import { BlockQueryError } from '../errors/BlockQueryError';

type BlockQueryInternal =
  | { kind: 'optimistic' }
  | { kind: 'doomslug' }
  | { kind: 'final' }
  | { kind: 'earliest' }
  | { kind: 'genesis' }
  | { kind: 'height'; height: number }
  | { kind: 'hash'; hash: string };

export class BlockQuery {
  private readonly internal: BlockQueryInternal;

  private constructor(internal: BlockQueryInternal) {
    this.internal = internal;
  }

  private unexpectedKind(): never {
    throw new BlockQueryError(`Unexpected kind: ${this.internal.kind}`);
  }

  static fromReference(reference: BlockReference): BlockQuery {
    if ('finality' in reference && reference.finality === 'optimistic') {
      return BlockQuery.OPTIMISTIC;
    }

    if ('finality' in reference && reference.finality === 'near-final') {
      return BlockQuery.DOOMSLUG;
    }

    if ('finality' in reference && reference.finality === 'final') {
      return BlockQuery.FINAL;
    }

    if ('sync_checkpoint' in reference && reference.sync_checkpoint === 'earliest_available') {
      return BlockQuery.EARLIEST;
    }

    if ('sync_checkpoint' in reference && reference.sync_checkpoint === 'genesis') {
      return BlockQuery.GENESIS;
    }

    if ('blockId' in reference && typeof reference.blockId === 'number') {
      return BlockQuery.height(reference.blockId);
    }

    if ('blockId' in reference && typeof reference.blockId === 'string') {
      return BlockQuery.hash(reference.blockId);
    }

    throw new BlockQueryError(`Unexpected reference: ${JSON.stringify(reference)}`);
  }

  toReference(): BlockReference {
    if (this.internal.kind === 'optimistic') {
      return { finality: 'optimistic' };
    }

    if (this.internal.kind === 'doomslug') {
      return { finality: 'near-final' };
    }

    if (this.internal.kind === 'final') {
      return { finality: 'final' };
    }

    if (this.internal.kind === 'earliest') {
      return { sync_checkpoint: 'earliest_available' };
    }

    if (this.internal.kind === 'genesis') {
      return { sync_checkpoint: 'genesis' };
    }

    if (this.internal.kind === 'height') {
      return { blockId: this.internal.height };
    }

    if (this.internal.kind === 'hash') {
      return { blockId: this.internal.hash };
    }

    this.unexpectedKind();
  }

  /**
   * Query at optimistic block
   */
  static get OPTIMISTIC(): BlockQuery {
    return new BlockQuery({ kind: 'optimistic' });
  }

  /**
   * Query at doomslug final block
   */
  static get DOOMSLUG(): BlockQuery {
    return new BlockQuery({ kind: 'doomslug' });
  }

  /**
   * Query at final block
   */
  static get FINAL(): BlockQuery {
    return new BlockQuery({ kind: 'final' });
  }

  /**
   * Query at earliest available block
   */
  static get EARLIEST(): BlockQuery {
    return new BlockQuery({ kind: 'earliest' });
  }

  /**
   * Query at genesis block
   */
  static get GENESIS(): BlockQuery {
    return new BlockQuery({ kind: 'genesis' });
  }

  /**
   * Query at certain block with block height
   */
  static height(height: number): BlockQuery {
    return new BlockQuery({ kind: 'height', height });
  }

  /**
   * Query at certain block with block hash
   */
  static hash(hash: string): BlockQuery {
    return new BlockQuery({ kind: 'hash', hash });
  }

  /**
   * Convert current block query to that with certain block height.
   * This is useful when need multiple queries at the same block
   *
   * @example
   * const blockQuery = BlockQuery.FINAL;
   *
   * const supply1 = await account.view({
   *   contractId: 'wrap.near',
   *   methodName: 'ft_total_supply',
   *   blockQuery
   * });
   *
   * // supply2 may not be equal to supply1 because they may be queried at different block
   * const supply2 = await account.view({
   *   contractId: 'wrap.near',
   *   methodName: 'ft_total_supply',
   *   blockQuery
   * });
   *
   *@example
   * const blockQuery = await BlockQuery.FINAL.height(provider);
   *
   * const supply1 = await account.view({
   *   contractId: 'wrap.near',
   *   methodName: 'ft_total_supply',
   *   blockQuery
   * });
   *
   * // supply2 must be equal to supply1 because they are queried at the same block
   * const supply2 = await account.view({
   *   contractId: 'wrap.near',
   *   methodName: 'ft_total_supply',
   *   blockQuery
   * });
   */
  async height(provider: Provider): Promise<BlockQuery> {
    if (this.internal.kind === 'height') {
      return BlockQuery.height(this.internal.height);
    }
    const block = await provider.block(this.toReference());
    return BlockQuery.height(block.header.height);
  }

  /**
   * Convert current block query to that with certain block hash.
   * This is useful when need multiple queries at the same block
   *
   * @example
   * const blockQuery = BlockQuery.FINAL;
   *
   * const supply1 = await account.view({
   *   contractId: 'wrap.near',
   *   methodName: 'ft_total_supply',
   *   blockQuery
   * });
   *
   * // supply2 may not be equal to supply1 because they may be queried at different block
   * const supply2 = await account.view({
   *   contractId: 'wrap.near',
   *   methodName: 'ft_total_supply',
   *   blockQuery
   * });
   *
   *@example
   * const blockQuery = await BlockQuery.FINAL.hash(provider);
   *
   * const supply1 = await account.view({
   *   contractId: 'wrap.near',
   *   methodName: 'ft_total_supply',
   *   blockQuery
   * });
   *
   * // supply2 must be equal to supply1 because they are queried at the same block
   * const supply2 = await account.view({
   *   contractId: 'wrap.near',
   *   methodName: 'ft_total_supply',
   *   blockQuery
   * });
   */
  async hash(provider: Provider): Promise<BlockQuery> {
    if (this.internal.kind === 'hash') {
      return BlockQuery.hash(this.internal.hash);
    }
    const block = await provider.block(this.toReference());
    return BlockQuery.hash(block.header.hash);
  }
}
