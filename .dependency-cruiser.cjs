/**
 * Second line of architectural defence.
 *
 * ESLint (boundaries) gives instant per-import feedback in the IDE;
 * dependency-cruiser sees the whole graph: cycles, orphans, reachability
 * and the architecture picture for a PR.
 *
 * Run: npm run arch | npm run arch:graph
 */

/** Feature layers live at src/app/features/<feature>/<layer>/... */
const FEATURE = String.raw`^src/app/features/([^/]+)`;

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    // Structural integrity.
    {
      name: 'no-circular',
      severity: 'error',
      comment:
        'Circular dependency. Break it with a port (interface) in a lower layer, or with events.',
      from: {},
      to: { circular: true },
    },
    {
      name: 'no-orphans',
      severity: 'error',
      comment:
        'Module depends on nothing and nothing depends on it - likely dead code (see also npm run deadcode).',
      from: {
        orphan: true,
        pathNot: [
          String.raw`(^|/)\.[^/]+\.(js|cjs|mjs|ts)$`,
          String.raw`\.d\.ts$`,
          String.raw`(^|/)tsconfig\.[^/]+\.json$`,
          String.raw`^src/main\.ts$`,
          String.raw`\.spec\.ts$`,
        ],
      },
      to: {},
    },
    {
      name: 'no-unresolvable',
      severity: 'error',
      comment: 'Import does not resolve: wrong path or missing dependency.',
      from: {},
      to: { couldNotResolve: true },
    },
    {
      name: 'not-to-spec',
      severity: 'error',
      comment: 'Production code must not import tests.',
      from: { pathNot: String.raw`\.spec\.ts$` },
      to: { path: String.raw`\.spec\.ts$` },
    },

    // Clean architecture invariants.
    {
      name: 'domain-is-framework-agnostic',
      severity: 'error',
      comment:
        'Domain must stay plain TypeScript: no Angular, no RxJS. Declare a port and implement it in infrastructure.',
      from: { path: `${FEATURE}/domain/` },
      to: { dependencyTypes: ['npm'], path: '^node_modules/(@angular|rxjs)' },
    },
    {
      name: 'domain-depends-on-nothing',
      severity: 'error',
      comment:
        'Domain may only depend on its own domain and shared/kernel. Specs are exempt — see domain-specs-stay-close.',
      from: { path: `${FEATURE}/domain/`, pathNot: String.raw`\.spec\.ts$` },
      to: {
        path: '^src/',
        pathNot: [`${FEATURE}/domain/`, '^src/app/shared/kernel/'],
      },
    },
    {
      name: 'domain-specs-stay-close',
      severity: 'error',
      comment: 'Domain specs may additionally reach shared/testing helpers.',
      from: { path: `${FEATURE}/domain/.*\\.spec\\.ts$` },
      to: {
        path: '^src/',
        pathNot: [`${FEATURE}/domain/`, '^src/app/shared/kernel/', '^src/app/shared/testing/'],
      },
    },
    {
      name: 'application-has-no-transport',
      severity: 'error',
      comment: 'Use-cases know nothing about HTTP, router or DOM - only ports.',
      from: { path: `${FEATURE}/application/` },
      to: {
        dependencyTypes: ['npm'],
        path: '^node_modules/(@angular/common/http|@angular/router|@angular/platform-browser)',
      },
    },
    {
      name: 'application-does-not-depend-on-outer-layers',
      severity: 'error',
      comment:
        'Dependencies point inwards: application cannot see infrastructure or ui. Specs are exempt: they verify the wiring against the real content.',
      from: { path: `${FEATURE}/application/`, pathNot: String.raw`\.spec\.ts$` },
      to: { path: `${FEATURE}/(infrastructure|ui)/` },
    },
    {
      name: 'ui-does-not-touch-infrastructure',
      severity: 'error',
      comment:
        'UI depends on an application port; the adapter is wired by the feature DI provider. Specs are exempt: they verify the wiring against the real content.',
      from: { path: `${FEATURE}/ui/`, pathNot: String.raw`\.spec\.ts$` },
      to: { path: `${FEATURE}/infrastructure/` },
    },
    {
      name: 'infrastructure-does-not-depend-on-ui',
      severity: 'error',
      comment: 'An adapter does not know who renders it.',
      from: { path: `${FEATURE}/infrastructure/` },
      to: { path: `${FEATURE}/ui/` },
    },
    {
      name: 'no-deep-import-across-features',
      severity: 'error',
      comment:
        'Another feature is a black box. Import only its public API: features/<feature>/index.ts.',
      from: { path: `${FEATURE}/` },
      to: {
        path: String.raw`^src/app/features/[^/]+/(domain|application|infrastructure|ui)/`,
        pathNot: String.raw`^src/app/features/$1/`,
      },
    },
    {
      name: 'shared-knows-nothing-about-features',
      severity: 'error',
      comment: 'shared/ is reused by everyone, so it cannot depend on a specific feature.',
      from: { path: '^src/app/shared/' },
      to: { path: '^src/app/features/' },
    },
    {
      name: 'shared-kernel-is-pure',
      severity: 'error',
      comment:
        'shared/kernel is the domain foundation: no framework, no other layers. Specs are exempt — they may import the test runner.',
      from: { path: '^src/app/shared/kernel/', pathNot: String.raw`\.spec\.ts$` },
      to: { pathNot: ['^src/app/shared/kernel/'] },
    },
    {
      name: 'http-only-in-infrastructure',
      severity: 'error',
      comment: 'HttpClient belongs to infrastructure and core (interceptors, providers) only.',
      from: { path: '^src/app/', pathNot: [`${FEATURE}/infrastructure/`, '^src/app/core/'] },
      to: { dependencyTypes: ['npm'], path: '^node_modules/@angular/common/http' },
    },

    // Dependency hygiene.
    {
      name: 'not-to-dev-dep',
      severity: 'error',
      comment: 'Production code must not depend on devDependencies.',
      from: { path: '^src/', pathNot: String.raw`\.spec\.ts$` },
      to: { dependencyTypes: ['npm-dev'], dependencyTypesNot: ['type-only'] },
    },
    {
      name: 'no-duplicate-dep-types',
      severity: 'warn',
      comment: 'Package is declared in both dependencies and devDependencies.',
      from: {},
      to: { moreThanOneDependencyType: true, dependencyTypesNot: ['type-only'] },
    },
    {
      name: 'not-to-unresolvable-package',
      severity: 'error',
      comment: 'Importing a package that is not in package.json.',
      from: {},
      to: { dependencyTypes: ['unknown', 'undetermined', 'npm-no-pkg', 'npm-unknown'] },
    },
    {
      name: 'no-deprecated-core',
      severity: 'error',
      comment: 'Deprecated Node.js core module.',
      from: {},
      to: { dependencyTypes: ['core'], path: '^(punycode|domain|sys|querystring)$' },
    },
  ],

  options: {
    doNotFollow: { path: 'node_modules' },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.json' },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default', 'types'],
      extensions: ['.ts', '.js', '.mjs', '.cjs', '.json'],
      mainFields: ['module', 'main', 'types', 'typings'],
    },
    // Keep node_modules in the graph: without those nodes the banned-package
    // rules silently pass. doNotFollow above prevents descending into packages.
    exclude: { path: '^(dist|coverage|\\.angular)/' },
    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/(?:@[^/]+/[^/]+|[^/]+)',
        theme: {
          graph: { rankdir: 'TB', splines: 'ortho', bgcolor: 'transparent' },
          modules: [
            { criteria: { source: '/domain/' }, attributes: { fillcolor: '#c8e6c9' } },
            { criteria: { source: '/application/' }, attributes: { fillcolor: '#bbdefb' } },
            { criteria: { source: '/infrastructure/' }, attributes: { fillcolor: '#ffe0b2' } },
            { criteria: { source: '/ui/' }, attributes: { fillcolor: '#f8bbd0' } },
            { criteria: { source: '^src/app/shared/' }, attributes: { fillcolor: '#e1bee7' } },
            { criteria: { source: '^src/app/core/' }, attributes: { fillcolor: '#cfd8dc' } },
          ],
        },
      },
      archi: {
        collapsePattern:
          '^src/app/(features/[^/]+/(domain|application|infrastructure|ui)|core|shared(/kernel)?)',
      },
    },
  },
};
