import { describe, expect, it } from 'vitest';

import { must } from '../../../../shared/testing/must';
import { technologyCluster } from './technology-cluster';

describe('technologyCluster', () => {
  it('creates a cluster of technologies under one caption', () => {
    const created = must(
      technologyCluster.create({
        technologies: ['Axum', 'Tokio', 'SQLx'],
        emphasis: 'lead',
      }),
    );

    expect(created.technologies.map((tech) => tech.name)).toEqual(['Axum', 'Tokio', 'SQLx']);
    expect(created.emphasis).toBe('lead');
  });

  it('rejects an empty cluster', () => {
    expect(technologyCluster.create({ technologies: [], emphasis: 'supporting' })).toEqual({
      ok: false,
      error: { kind: 'InvalidTechnologyCluster' },
    });
  });

  it('rejects an invalid technology inside the cluster', () => {
    expect(
      technologyCluster.create({ technologies: ['Axum', '!!!'], emphasis: 'supporting' }),
    ).toEqual({ ok: false, error: { kind: 'InvalidTechnologyCluster' } });
  });
});
