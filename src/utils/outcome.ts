import { FinalExecutionOutcome, FinalExecutionStatus } from 'near-api-js/lib/providers';
import { parseRpcError } from 'near-api-js/lib/utils/rpc_errors';
import { Buffer } from 'buffer';
import { Parser } from './Parser';

export function toParseableFinalExecutionOutcome(outcome: FinalExecutionOutcome): ParseableFinalExecutionOutcome {
  return {
    ...outcome,

    parse<T>(parser: Parser<T> = Parser.json()): T {
      return parseOutcomeValue(outcome, parser);
    },
  };
}

export function toParseableFinalExecutionOutcomes(outcomes: FinalExecutionOutcome[]): ParseableFinalExecutionOutcome[] {
  return outcomes.map((outcome) => toParseableFinalExecutionOutcome(outcome));
}

export interface ParseableFinalExecutionOutcome extends FinalExecutionOutcome {
  /**
   * Parse success value.
   * @param parser Parser
   */
  parse<T>(parser?: Parser<T>): T;
}

/**
 * Parse success value from outcome.
 * @param outcome Transaction outcome
 * @param parser Parser
 */
export function parseOutcomeValue<Value>(outcome: FinalExecutionOutcome, parser: Parser<Value>): Value {
  const successValue = (outcome.status as FinalExecutionStatus).SuccessValue;
  if (successValue) {
    const valueRaw = Buffer.from(successValue, 'base64');
    return parser.parse(valueRaw);
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
