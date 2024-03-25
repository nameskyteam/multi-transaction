import { UnreachableError } from '../errors';

export function endless(): never {
  while (true) {
    // endless loop
  }
}

export function unreachable(): never {
  throw new UnreachableError();
}
