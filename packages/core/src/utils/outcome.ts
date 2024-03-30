import { FinalExecutionOutcome, FinalExecutionStatus } from '@near-js/types';
import { parseRpcError } from '@near-js/utils';
import { Buffer } from 'buffer';
import { Parser } from './Parser';
import { ParseOutcomeError, ReceiptErrorMessage, ReceiptError } from '../errors';

export function parseOutcomeValue<Value>(outcome: FinalExecutionOutcome, parser: Parser<Value> = Parser.json()): Value {
  const successValue = (outcome.status as FinalExecutionStatus).SuccessValue;
  if (successValue) {
    const valueRaw = Buffer.from(successValue, 'base64');
    return parser.parse(valueRaw);
  } else if (successValue === '') {
    return undefined as Value;
  } else {
    throw new ParseOutcomeError(`Execution status is Failure`);
  }
}

export function throwReceiptErrorsFromOutcomes(outcomes: FinalExecutionOutcome[]) {
  const errors = outcomes.map((outcome) => getReceiptErrorsFromOutcome(outcome)).flat();
  if (errors.length !== 0) {
    throw new ReceiptError(errors);
  }
}

function getReceiptErrorsFromOutcome(outcome: FinalExecutionOutcome): ReceiptErrorMessage[] {
  const errors: ReceiptErrorMessage[] = [];
  outcome.receipts_outcome.forEach((receipt) => {
    const status = receipt.outcome.status;
    if (typeof status !== 'string' && status.Failure) {
      const serverError = parseRpcError(status.Failure);
      const errorMessage = JSON.parse(serverError.message);
      errors.push(errorMessage);
    }
  });
  return errors;
}
