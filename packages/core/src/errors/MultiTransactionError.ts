export class MultiTransactionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MultiTransactionError';
  }
}
