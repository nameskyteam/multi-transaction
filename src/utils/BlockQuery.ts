import { BlockReference } from 'near-api-js/lib/providers/provider';
import { Provider } from '@near-wallet-selector/core/src/lib/services';

export class BlockQuery {
  private readonly reference: BlockReference;

  private constructor(reference: BlockReference) {
    this.reference = reference;
  }

  static from(reference: BlockReference) {
    return new BlockQuery(reference);
  }

  into(): BlockReference {
    return this.reference;
  }

  /**
   * Query at optimistic block
   */
  static get optimistic(): BlockQuery {
    return BlockQuery.from({ finality: 'optimistic' });
  }

  /**
   * Query at final block
   */
  static get final(): BlockQuery {
    return BlockQuery.from({ finality: 'final' });
  }

  /**
   * Query at doomslug final block
   */
  static get doomslug(): BlockQuery {
    return BlockQuery.from({ finality: 'near-final' });
  }

  /**
   * Query at genesis block
   */
  static get genesis(): BlockQuery {
    return BlockQuery.from({ sync_checkpoint: 'genesis' });
  }

  /**
   * Query at earliest available block
   */
  static get earliest(): BlockQuery {
    return BlockQuery.from({ sync_checkpoint: 'earliest_available' });
  }

  /**
   * Query at certain block with block height
   */
  static height(h: number): BlockQuery {
    return BlockQuery.from({ blockId: h });
  }

  /**
   * Query at certain block with block hash
   */
  static hash(h: string): BlockQuery {
    return BlockQuery.from({ blockId: h });
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
    if ('blockId' in this.reference && typeof this.reference.blockId === 'number') {
      return BlockQuery.height(this.reference.blockId);
    }

    const block = await provider.block(this.reference);
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
    if ('blockId' in this.reference && typeof this.reference.blockId === 'string') {
      return BlockQuery.hash(this.reference.blockId);
    }

    const block = await provider.block(this.reference);
    return BlockQuery.hash(block.header.hash);
  }
}
