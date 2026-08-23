import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { translateSignal } from '@jsverse/transloco';

import { GetSkillGroupsHandler } from '../../application/queries/get-skill-groups/get-skill-groups';

import { LocaleService } from '../../../../shared/i18n/locale.service';

interface StackEntry {
  readonly name: string;
  readonly lead: boolean;
}

interface StackGroupCard {
  readonly title: string;
  readonly entries: readonly StackEntry[];
}

/** Stack section: skill groups, lead picks visually accented. */
@Component({
  selector: 'app-stack-section',
  templateUrl: './stack-section.html',
  styleUrl: './stack-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackSection {
  private readonly getSkillGroups = inject(GetSkillGroupsHandler);
  private readonly localeService = inject(LocaleService);

  protected readonly kicker = translateSignal('nav.stack');
  protected readonly title = translateSignal('stack.title');

  private readonly skillGroups = this.getSkillGroups.handle({ kind: 'getSkillGroups' });

  protected readonly groups = computed<readonly StackGroupCard[]>(() =>
    this.skillGroups().map((group) => ({
      title: this.localeService.pick(group.title),
      entries: group.entries.map((entry) => ({
        name: entry.technology.name,
        lead: entry.lead,
      })),
    })),
  );
}
