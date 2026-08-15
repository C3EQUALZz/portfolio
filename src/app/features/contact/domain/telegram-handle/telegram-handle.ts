import type { Brand } from '../../../../shared/kernel/brand/brand';
import { err, ok, type Result } from '../../../../shared/kernel/result/result';

/**
 * Telegram username without the leading '@': 5–32 chars of letters, digits
 * and underscores, starting with a letter. Feature-local primitive — unlike
 * Technology, nothing outside contact needs it.
 */
export type TelegramHandle = Brand<string, 'TelegramHandle'>;

export interface InvalidTelegramHandle {
  readonly kind: 'InvalidTelegramHandle';
}

const INVALID: InvalidTelegramHandle = { kind: 'InvalidTelegramHandle' };

const HANDLE_PATTERN = /^[a-zA-Z][a-zA-Z0-9_]{4,31}$/;

export const telegramHandle = {
  create(raw: string): Result<TelegramHandle, InvalidTelegramHandle> {
    return HANDLE_PATTERN.test(raw) ? ok(raw as TelegramHandle) : err(INVALID);
  },
};
