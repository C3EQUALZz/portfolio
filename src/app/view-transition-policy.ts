/**
 * View transition policy: which navigations animate. The router fires a view
 * transition on every navigation, including anchor-only ones on the same
 * route — those are scrolling, not a page switch, and must not flash.
 * See docs/adr/0004-page-view-transitions.md.
 */

/**
 * The minimal shape of an ActivatedRouteSnapshot root — enough to read the
 * matched route path. Structural on purpose, so the policy stays testable
 * without constructing real router snapshots.
 */
export interface RouteSnapshotNode {
  readonly url: readonly { readonly path: string }[];
  readonly firstChild: RouteSnapshotNode | null;
}

/** The matched route path ('' for the landing). Fragments are not part of it. */
export function routePathOf(root: RouteSnapshotNode): string {
  let node = root;
  while (node.firstChild !== null) {
    node = node.firstChild;
  }
  return node.url.map((segment) => segment.path).join('/');
}

/** Skip the transition when the route stays the same (anchor navigation). */
export function shouldSkipViewTransition(from: RouteSnapshotNode, to: RouteSnapshotNode): boolean {
  return routePathOf(from) === routePathOf(to);
}
