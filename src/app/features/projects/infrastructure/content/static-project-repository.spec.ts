import { describe, expect, it } from 'vitest';

import { staticProjectRepository } from './static-project-repository';

describe('staticProjectRepository', () => {
  it('lists the projects from the content', async () => {
    const result = await staticProjectRepository.list();
    if (!result.ok) {
      throw new Error('repository must list the projects');
    }

    expect(result.value).toHaveLength(4);
  });
});
