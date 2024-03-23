import { BlockReference } from 'near-api-js/lib/providers/provider';
import { Provider } from 'near-api-js/lib/providers';

type EnumerableBlockQuery =
  | { kind: 'optimistic' }
  | { kind: 'doomslug' }
  | { kind: 'final' }
  | { kind: 'earliest' }
  | { kind: 'genesis' }
  | { kind: 'height'; height: number }
  | { kind: 'hash'; hash: string };

export class BlockQuery {
  private readonly query: EnumerableBlockQuery;

  private constructor(query: EnumerableBlockQuery) {
    this.query = query;
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

    throw Error(`Unreachable`);
  }

  toReference(): BlockReference {
    switch (this.query.kind) {
      case 'optimistic':
        return { finality: 'optimistic' };
      case 'doomslug':
        return { finality: 'near-final' };
      case 'final':
        return { finality: 'final' };
      case 'earliest':
        return { sync_checkpoint: 'earliest_available' };
      case 'genesis':
        return { sync_checkpoint: 'genesis' };
      case 'height':
        return { blockId: this.query.height };
      case 'hash':
        return { blockId: this.query.hash };
    }
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
   * const blockQuery = BlockQuery.final;
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
   * const blockQuery = await BlockQuery.final.height(provider);
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
    if (this.query.kind === 'height') {
      return BlockQuery.height(this.query.height);
    }
    const block = await provider.block(this.toReference());
    return BlockQuery.height(block.header.height);
  }

  /**
   * Convert current block query to that with certain block hash.
   * This is useful when need multiple queries at the same block
   *
   * @example
   * const blockQuery = BlockQuery.final;
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
   * const blockQuery = await BlockQuery.final.hash(provider);
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
    if (this.query.kind === 'hash') {
      return BlockQuery.hash(this.query.hash);
    }
    const block = await provider.block(this.toReference());
    return BlockQuery.hash(block.header.hash);
  }
}
