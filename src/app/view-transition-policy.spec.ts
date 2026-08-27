import {
  routePathOf,
  type RouteSnapshotNode,
  shouldSkipViewTransition,
} from './view-transition-policy';

function rootOf(...segments: string[]): RouteSnapshotNode {
  return {
    url: [],
    firstChild:
      segments.length === 0 ? null : { url: segments.map((path) => ({ path })), firstChild: null },
  };
}

describe('routePathOf', () => {
  it('is empty for the landing route', () => {
    expect(routePathOf(rootOf())).toBe('');
  });

  it('is the matched segment of an inner page', () => {
    expect(routePathOf(rootOf('certificates'))).toBe('certificates');
  });
});

describe('shouldSkipViewTransition', () => {
  it('skips the transition when only the fragment changes', () => {
    expect(shouldSkipViewTransition(rootOf(), rootOf())).toBe(true);
  });

  it('animates a route change', () => {
    expect(shouldSkipViewTransition(rootOf(), rootOf('certificates'))).toBe(false);
  });

  it('animates the way back to the landing', () => {
    expect(shouldSkipViewTransition(rootOf('stats'), rootOf())).toBe(false);
  });
});
