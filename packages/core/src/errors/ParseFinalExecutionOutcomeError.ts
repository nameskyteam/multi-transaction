export class ParseFinalExecutionOutcomeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParseFinalExecutionOutcomeError';
  }
}
