import { inject, Injectable } from '@angular/core';

import type { CodingPlatform } from '../../../domain/coding-platform/coding-platform';

import type { Command, CommandHandler } from '../../../../../shared/cqs/command/command';
import { ok, type Result } from '../../../../../shared/kernel/result/result';
import { CodingStatsStore } from '../../coding-stats-store/coding-stats-store';

/** The write request: drop the platform's cache and re-fetch now. */
export interface RefreshCodingStatsCommand extends Command {
  readonly kind: 'refreshCodingStats';
  readonly platform: CodingPlatform;
}

/**
 * The retry/refresh behind the card button. Fire-and-forget by design: the
 * reload drives the store's signals, and the card re-renders from those.
 */
@Injectable({ providedIn: 'root' })
export class RefreshCodingStatsHandler implements CommandHandler<
  RefreshCodingStatsCommand,
  null,
  never
> {
  private readonly store = inject(CodingStatsStore);

  handle(command: RefreshCodingStatsCommand): Promise<Result<null, never>> {
    this.store.refresh(command.platform);
    return Promise.resolve(ok(null));
  }
}
