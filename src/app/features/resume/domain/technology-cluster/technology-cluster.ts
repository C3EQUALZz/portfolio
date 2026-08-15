import { collect, err, ok, type Result } from '../../../../shared/kernel/result/result';
import { technology, type Technology } from '../../../../shared/kernel/technology/technology';

/**
 * Several technologies the candidate deliberately merged into one caption
 * under an Experience, with the emphasis on the cluster as a whole:
 * "Frida · Androguard · YARA". See CONTEXT.md.
 */
export interface TechnologyCluster {
  readonly technologies: readonly Technology[];
  readonly emphasis: 'lead' | 'supporting';
}

export interface InvalidTechnologyCluster {
  readonly kind: 'InvalidTechnologyCluster';
}

const INVALID: InvalidTechnologyCluster = { kind: 'InvalidTechnologyCluster' };

export const technologyCluster = {
  create(input: {
    readonly technologies: readonly string[];
    readonly emphasis: 'lead' | 'supporting';
  }): Result<TechnologyCluster, InvalidTechnologyCluster> {
    const technologies = collect(
      input.technologies.map((name) => {
        const parsed = technology.create(name);
        return parsed.ok ? ok(parsed.value) : err(INVALID);
      }),
    );
    if (!technologies.ok || technologies.value.length === 0) {
      return err(INVALID);
    }
    return ok({ technologies: technologies.value, emphasis: input.emphasis });
  },
};
