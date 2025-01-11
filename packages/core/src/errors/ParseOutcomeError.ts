export class ParseOutcomeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParseOutcomeError';
  }
}
