import { FinalExecutionOutcome, FinalExecutionStatus } from 'near-api-js/lib/providers';
import { parseRpcError } from 'near-api-js/lib/utils/rpc_errors';
import { Parser } from '../types';
import { Buffer } from 'buffer';
import { parseJson } from '../serde';

/**
 * Parse success value from outcome.
 * @param outcome Transaction outcome
 * @param parse Deserialize returned value from bytes. Default in JSON format
 */
export function parseOutcomeValue<Value>(outcome: FinalExecutionOutcome, parse: Parser<Value> = parseJson): Value {
  const successValue = (outcome.status as FinalExecutionStatus).SuccessValue;
  if (successValue) {
    const valueRaw = Buffer.from(successValue, 'base64');
    return parse(valueRaw);
  } else if (successValue === '') {
    return undefined as Value;
  } else {
    throw Error(`Outcome status is Failure`);
  }
}

/**
 * If receipts in outcomes have any error, throw them
 * @param outcomes Transaction outcomes
 */
export function throwReceiptErrorsIfAny(...outcomes: FinalExecutionOutcome[]) {
  throwReceiptErrors(getReceiptErrors(...outcomes));
}

function getReceiptErrors(...outcomes: FinalExecutionOutcome[]): ErrorMessage[] {
  const errors: ErrorMessage[] = [];
  outcomes.forEach((outcome) => {
    outcome.receipts_outcome.forEach((receipt) => {
      const status = receipt.outcome.status;
      if (typeof status !== 'string' && status.Failure) {
        const serverError = parseRpcError(status.Failure);
        const errorMessage = JSON.parse(serverError.message);
        errors.push(errorMessage);
      }
    });
  });
  return errors;
}

function throwReceiptErrors(errors: ErrorMessage[]) {
  if (errors.length !== 0) {
    throw Error(JSON.stringify(errors));
  }
}

interface ErrorMessage {
  index: number;
  kind: {
    ExecutionError: string;
  };
}
