import type { Brand } from './brand';
import { err, ok, type Result } from './result';

/** Outbound link. HTTPS only: insecure schemes are rejected at the boundary. */
export type HttpsUrl = Brand<string, 'HttpsUrl'>;

export interface InvalidUrl {
  readonly kind: 'InvalidUrl';
}

const INVALID: InvalidUrl = { kind: 'InvalidUrl' };

export const httpsUrl = {
  create(raw: string): Result<HttpsUrl, InvalidUrl> {
    try {
      const url = new URL(raw);
      return url.protocol === 'https:' ? ok(raw as HttpsUrl) : err(INVALID);
    } catch {
      return err(INVALID);
    }
  },
};
