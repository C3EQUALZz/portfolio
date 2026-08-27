import type { SingleSourceError } from '../../domain/coding-stats-source/coding-stats-source';

import { err, ok, type Result } from '../../../../shared/kernel/result/result';

/** The fetch surface the adapters rely on — injectable for specs. */
export type FetchLike = (url: string, init: { signal: AbortSignal }) => Promise<Response>;

const TIMEOUT: SingleSourceError = { kind: 'SourceTimeout' };
const UNAVAILABLE: SingleSourceError = { kind: 'SourceUnavailable' };
const NOT_FOUND: SingleSourceError = { kind: 'ProfileNotFound' };

/**
 * One HTTP GET returning parsed JSON, with an explicit timeout. Browser fetch
 * has no timeout of its own, and a hung socket would otherwise pin the
 * failover chain forever — hence the AbortController around every attempt.
 */
export async function fetchJson(
  url: string,
  timeoutMs: number,
  fetchImpl: FetchLike = (input, init) => fetch(input, init),
): Promise<Result<unknown, SingleSourceError>> {
  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort();
  }, timeoutMs);
  try {
    const response = await fetchImpl(url, { signal: controller.signal });
    if (response.status === 404) {
      return err(NOT_FOUND);
    }
    if (!response.ok) {
      return err(UNAVAILABLE);
    }
    return ok((await response.json()) as unknown);
  } catch {
    return err(controller.signal.aborted ? TIMEOUT : UNAVAILABLE);
  } finally {
    clearTimeout(timer);
  }
}
