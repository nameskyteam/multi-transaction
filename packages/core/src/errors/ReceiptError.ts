export class ReceiptError extends Error {
  constructor(messages: ReceiptErrorMessage[]) {
    super(JSON.stringify(messages));
    this.name = 'ReceiptError';
  }
}

export type ReceiptErrorMessage = {
  index: number;
  kind: {
    ExecutionError: string;
  };
};
