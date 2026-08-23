import type { Signal } from '@angular/core';

/**
 * A read request: a discriminated data object, no behaviour. The `kind`
 * discriminator keeps parameterless queries non-empty and leaves the door
 * open for a mediator without changing the contracts.
 */
export interface Query {
  readonly kind: string;
}

/**
 * Handles one query type. The result is reactive: a computed reading it
 * recomputes when the underlying state (loaded data, locale) changes.
 * Call `handle` once — in a field initializer — and bind the returned
 * signal; calling it in a template would create a new computed per CD pass.
 */
export interface QueryHandler<Q extends Query, D> {
  handle(query: Q): Signal<D>;
}
