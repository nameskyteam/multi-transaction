import { BlockReference } from 'near-api-js/lib/providers/provider';

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
}
