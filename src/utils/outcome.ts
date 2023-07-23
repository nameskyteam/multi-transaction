import { FinalExecutionOutcome, FinalExecutionStatus } from 'near-api-js/lib/providers';
import { parseRpcError } from 'near-api-js/lib/utils/rpc_errors';
import { Buffer } from 'buffer';
import { getParser, Parse } from '../serde';

export function getParseableFinalExecutionOutcome(outcome: FinalExecutionOutcome): ParseableFinalExecutionOutcome {
  return {
    ...outcome,

    parse<T>(parse: Parse<T>): T {
      return parseOutcomeValue(outcome, parse);
    },

    json<T>(): T {
      return parseOutcomeValue(outcome, 'json');
    },
  };
}

export function getParseableFinalExecutionOutcomes(
  outcomes: FinalExecutionOutcome[]
): ParseableFinalExecutionOutcome[] {
  return outcomes.map((outcome) => getParseableFinalExecutionOutcome(outcome));
}

export interface ParseableFinalExecutionOutcome extends FinalExecutionOutcome {
  /**
   * Parse success value.
   * @param parse Parse options
   */
  parse<T>(parse: Parse<T>): T;

  /**
   * Parse success value in JSON format.
   */
  json<T>(): T;
}

/**
 * Parse success value from outcome.
 * @param outcome Transaction outcome
 * @param parse Parse options
 */
export function parseOutcomeValue<Value>(outcome: FinalExecutionOutcome, parse: Parse<Value>): Value {
  const successValue = (outcome.status as FinalExecutionStatus).SuccessValue;
  if (successValue) {
    const valueRaw = Buffer.from(successValue, 'base64');
    return getParser(parse)(valueRaw);
  } else if (successValue === '') {
    return undefined as Value;
  } else {
    throw Error(`Outcome status is Failure`);
  }
}

export function throwReceiptErrorsFromOutcome(outcome: FinalExecutionOutcome) {
  const errors = getReceiptErrorsFromOutcome(outcome);
  if (errors.length !== 0) {
    throw Error(JSON.stringify(errors));
  }
}

export function throwReceiptErrorsFromOutcomes(outcomes: FinalExecutionOutcome[]) {
  const errors = outcomes.map((outcome) => getReceiptErrorsFromOutcome(outcome)).flat();
  if (errors.length !== 0) {
    throw Error(JSON.stringify(errors));
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

interface ReceiptErrorMessage {
  index: number;
  kind: {
    ExecutionError: string;
  };
}
