import { FinalExecutionOutcome, FinalExecutionStatus } from 'near-api-js/lib/providers';
import { parseRpcError } from 'near-api-js/lib/utils/rpc_errors';
import { Buffer } from 'buffer';
import { getParser, Parse, WrapperClass } from '../serde';
import { Class } from '../types';

export function getParseableFinalExecutionOutcome(outcome: FinalExecutionOutcome): ParseableFinalExecutionOutcome {
  return {
    ...outcome,

    parse<T>(parse?: Parse<T>): T {
      return parseOutcomeValue(outcome, parse);
    },

    json<T>(): T {
      return parseOutcomeValue(outcome);
    },

    borsh<T>(type: Class<T> | WrapperClass<T>): T {
      return parseOutcomeValue(outcome, {
        method: 'borsh',
        type,
      });
    },
  };
}

export interface ParseableFinalExecutionOutcome extends FinalExecutionOutcome {
  /**
   * Parse success value
   * @param parse Parse options. Default in JSON format
   */
  parse<T>(parse?: Parse<T>): T;

  /**
   * Parse success value in JSON format
   */
  json<T>(): T;

  /**
   * Parse success value in borsh format
   * @param type Class of generics `T`
   */
  borsh<T>(type: Class<T>): T;
  /**
   * Parse success value in borsh format
   * @param type `Wrapper` class that wraps the generics `T`
   */
  borsh<T>(type: WrapperClass<T>): T;
  borsh<T>(type: Class<T> | WrapperClass<T>): T;
}

/**
 * Parse success value from outcome.
 * @param outcome Transaction outcome
 * @param parse Parse options. Default in JSON format
 */
export function parseOutcomeValue<Value>(outcome: FinalExecutionOutcome, parse: Parse<Value> = 'json'): Value {
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

export function throwReceiptErrorsIfAny(...outcomes: FinalExecutionOutcome[]) {
  const errors = getReceiptErrors(...outcomes);
  if (errors.length !== 0) {
    throw Error(JSON.stringify(errors));
  }
}

function getReceiptErrors(...outcomes: FinalExecutionOutcome[]): ReceiptErrorMessage[] {
  const errors: ReceiptErrorMessage[] = [];
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

export interface ReceiptErrorMessage {
  index: number;
  kind: {
    ExecutionError: string;
  };
}
