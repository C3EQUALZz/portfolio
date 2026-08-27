import type { Result } from '../../kernel/result/result';

/**
 * A write request: a discriminated data object, no behaviour. The `kind`
 * discriminator mirrors the Query contract and keeps commands mediator-ready.
 */
export interface Command {
  readonly kind: string;
}

/**
 * Handles one command type. Unlike a query, a command is a one-shot
 * operation: it resolves once with a Result, errors are values.
 */
export interface CommandHandler<C extends Command, T, E> {
  handle(command: C): Promise<Result<T, E>>;
}
