export class SendTransactionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SendTransactionError';
  }
}
