import type { Result } from '../kernel/result/result';

/** Unwraps a Result in tests: a failure here is a broken fixture, not behavior. */
export function must<T, E>(result: Result<T, E>): T {
  if (!result.ok) {
    throw new Error(`expected a successful result, got: ${JSON.stringify(result.error)}`);
  }
  return result.value;
}

/** Unwraps the error of a failed Result in tests. */
export function mustFail<T, E>(result: Result<T, E>): E {
  if (result.ok) {
    throw new Error('expected a failed result, got a success');
  }
  return result.error;
}
