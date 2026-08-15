import { describe, expect, it } from 'vitest';

import { must } from '../../../../shared/testing/must';
import { staticResumeRepository } from './static-resume-repository';

describe('staticResumeRepository', () => {
  it('loads the resume from the typed content literal', async () => {
    const result = await staticResumeRepository.load();

    expect(result.ok).toBe(true);
    const loaded = must(result);
    expect(loaded.experiences).toHaveLength(3);
    expect(loaded.person.name).toBe('Danil Kovalev');
  });
});
