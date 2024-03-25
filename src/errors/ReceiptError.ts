export class ReceiptError extends Error {
  constructor(messages: ReceiptErrorMessage[]) {
    super(JSON.stringify(messages));
  }
}

export type ReceiptErrorMessage = {
  index: number;
  kind: {
    ExecutionError: string;
  };
};
