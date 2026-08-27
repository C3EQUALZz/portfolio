import {
  computed,
  inject,
  Injectable,
  InjectionToken,
  resource,
  type ResourceRef,
  type Signal,
} from '@angular/core';

import type {
  CodingPlatform,
  CodingPlatformTarget,
} from '../../domain/coding-platform/coding-platform';

import { LoadCodingStats, type LoadedProfile } from '../load-coding-stats/load-coding-stats';

/** DI token for the content: which accounts the page shows. */
export const CODING_STATS_TARGETS = new InjectionToken<readonly CodingPlatformTarget[]>(
  'CODING_STATS_TARGETS',
);

/** Per-platform page state: independent, one platform's outage hides no other. */
export type PlatformStatsState =
  | { readonly status: 'loading' }
  | {
      readonly status: 'ready';
      readonly profile: LoadedProfile['profile'];
      readonly cachedAt: string;
      readonly stale: boolean;
      /** True while a background refresh is in flight. */
      readonly refreshing: boolean;
    }
  | { readonly status: 'unavailable' };

/**
 * Feature state: one resource per platform target. The loader is the
 * LoadCodingStats use case; a stale cache hit is rendered immediately and
 * revalidated in the background (stale-while-revalidate), a failure with no
 * cache is the `unavailable` card.
 */
@Injectable({ providedIn: 'root' })
export class CodingStatsStore {
  private readonly loader = inject(LoadCodingStats);
  private readonly targets = inject(CODING_STATS_TARGETS);

  private readonly resources = new Map<CodingPlatform, ResourceRef<LoadedProfile | undefined>>(
    this.targets.map((target) => {
      // `ref` is used inside its own initializer's loader — safe, because
      // resource() schedules the loader; it never runs before the assignment.
      const ref: ResourceRef<LoadedProfile | undefined> = resource({
        loader: async () => {
          const result = await this.loader.load(target);
          if (!result.ok) {
            // resource() wraps non-Error throws opaquely; the kind is enough,
            // the attempt log stays in the loader's Result for callers.
            throw new Error(result.error.kind);
          }
          if (result.value.stale) {
            // Show the stale value now; revalidate in the background. The
            // invalidate makes the reload bypass the cache.
            queueMicrotask(() => {
              this.loader.invalidate(target.platform);
              ref.reload();
            });
          }
          return result.value;
        },
      });
      return [target.platform, ref];
    }),
  );

  private readonly states = new Map<CodingPlatform, Signal<PlatformStatsState>>(
    [...this.resources].map(([platform, ref]) => [
      platform,
      computed<PlatformStatsState>(() => {
        // value() throws while the resource is in an error state — gate on
        // hasValue(), which also keeps stale data visible when a background
        // refresh fails.
        if (ref.hasValue()) {
          const value = ref.value();
          return {
            status: 'ready',
            profile: value.profile,
            cachedAt: value.cachedAt,
            stale: value.stale,
            refreshing: ref.isLoading(),
          };
        }
        return ref.error() === undefined ? { status: 'loading' } : { status: 'unavailable' };
      }),
    ]),
  );

  /** The reactive state of one platform — one signal per platform, shared. */
  state(platform: CodingPlatform): Signal<PlatformStatsState> {
    const found = this.states.get(platform);
    if (found === undefined) {
      throw new Error(`Unknown coding platform: ${platform}`);
    }
    return found;
  }

  /** Force a network refresh of one platform (the card's retry button). */
  refresh(platform: CodingPlatform): void {
    this.loader.invalidate(platform);
    this.resources.get(platform)?.reload();
  }
}
