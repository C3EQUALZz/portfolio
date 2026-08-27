import { describe, expect, it } from 'vitest';

import { CODING_PLATFORMS } from '../../domain/coding-platform/coding-platform';

import { codingStatsContent } from './coding-stats-content';

describe('codingStatsContent', () => {
  it('covers every supported platform exactly once, in display order', () => {
    expect(codingStatsContent.targets.map((target) => target.platform)).toEqual(CODING_PLATFORMS);
  });

  it('points every target at an https profile page', () => {
    for (const target of codingStatsContent.targets) {
      expect(target.profileUrl.startsWith('https://')).toBe(true);
      expect(target.handle.trim()).not.toBe('');
    }
  });

  it('keeps the LeetCode failover chain non-empty with https bases', () => {
    expect(codingStatsContent.leetcodeSources.length).toBeGreaterThan(0);
    for (const source of codingStatsContent.leetcodeSources) {
      expect(source.baseUrl.startsWith('https://')).toBe(true);
    }
  });

  it('has a sane cache TTL', () => {
    expect(Number.isInteger(codingStatsContent.ttlMinutes)).toBe(true);
    expect(codingStatsContent.ttlMinutes).toBeGreaterThan(0);
  });
});
