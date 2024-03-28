import { BlockReference } from 'near-api-js/lib/providers/provider';
import { Provider } from 'near-api-js/lib/providers';

export class BlockQuery {
  private readonly reference: BlockReference;

  private constructor(reference: BlockReference) {
    this.reference = reference;
  }

  static fromReference(reference: BlockReference): BlockQuery {
    return new BlockQuery(reference);
  }

  toReference(): BlockReference {
    return this.reference;
  }

  /**
   * Query at optimistic block
   */
  static get OPTIMISTIC(): BlockQuery {
    return new BlockQuery({ finality: 'optimistic' });
  }

  /**
   * Query at doomslug final block
   */
  static get DOOMSLUG(): BlockQuery {
    return new BlockQuery({ finality: 'near-final' });
  }

  /**
   * Query at final block
   */
  static get FINAL(): BlockQuery {
    return new BlockQuery({ finality: 'final' });
  }

  /**
   * Query at earliest available block
   */
  static get EARLIEST(): BlockQuery {
    return new BlockQuery({ sync_checkpoint: 'earliest_available' });
  }

  /**
   * Query at genesis block
   */
  static get GENESIS(): BlockQuery {
    return new BlockQuery({ sync_checkpoint: 'genesis' });
  }

  /**
   * Query at certain block with block height
   */
  static height(height: number): BlockQuery {
    return new BlockQuery({ blockId: height });
  }

  /**
   * Query at certain block with block hash
   */
  static hash(hash: string): BlockQuery {
    return new BlockQuery({ blockId: hash });
  }

  /**
   * Convert block query to that with certain block height.
   * This is useful when need multiple queries at the same block
   *
   * @example
   * const blockQuery = BlockQuery.FINAL;
   *
   * const supply1: string = await account.view({
   *   contractId: 'wrap.near',
   *   methodName: 'ft_total_supply',
   *   blockQuery
   * });
   *
   * // supply2 may not be equal to supply1 because they may be queried at different block
   * const supply2: string = await account.view({
   *   contractId: 'wrap.near',
   *   methodName: 'ft_total_supply',
   *   blockQuery
   * });
   *
   *@example
   * const blockQuery = await BlockQuery.FINAL.height(provider);
   *
   * const supply1: string = await account.view({
   *   contractId: 'wrap.near',
   *   methodName: 'ft_total_supply',
   *   blockQuery
   * });
   *
   * // supply2 must be equal to supply1 because they are queried at the same block
   * const supply2: string = await account.view({
   *   contractId: 'wrap.near',
   *   methodName: 'ft_total_supply',
   *   blockQuery
   * });
   */
  async height(provider: Provider): Promise<BlockQuery> {
    if ('blockId' in this.reference && typeof this.reference.blockId === 'number') {
      return BlockQuery.height(this.reference.blockId);
    }
    const block = await provider.block(this.toReference());
    return BlockQuery.height(block.header.height);
  }

  /**
   * Convert block query to that with certain block hash.
   * This is useful when need multiple queries at the same block
   *
   * @example
   * const blockQuery = BlockQuery.FINAL;
   *
   * const supply1: string = await account.view({
   *   contractId: 'wrap.near',
   *   methodName: 'ft_total_supply',
   *   blockQuery
   * });
   *
   * // supply2 may not be equal to supply1 because they may be queried at different block
   * const supply2: string = await account.view({
   *   contractId: 'wrap.near',
   *   methodName: 'ft_total_supply',
   *   blockQuery
   * });
   *
   *@example
   * const blockQuery = await BlockQuery.FINAL.hash(provider);
   *
   * const supply1: string = await account.view({
   *   contractId: 'wrap.near',
   *   methodName: 'ft_total_supply',
   *   blockQuery
   * });
   *
   * // supply2 must be equal to supply1 because they are queried at the same block
   * const supply2: string = await account.view({
   *   contractId: 'wrap.near',
   *   methodName: 'ft_total_supply',
   *   blockQuery
   * });
   */
  async hash(provider: Provider): Promise<BlockQuery> {
    if ('blockId' in this.reference && typeof this.reference.blockId === 'string') {
      return BlockQuery.hash(this.reference.blockId);
    }
    const block = await provider.block(this.toReference());
    return BlockQuery.hash(block.header.hash);
  }
}
