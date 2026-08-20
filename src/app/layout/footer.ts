import { ChangeDetectionStrategy, Component } from '@angular/core';

import { translateSignal } from '@jsverse/transloco';

/** Footer frame; the contact CTA fills it in the contact slice. */
@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  protected readonly note = translateSignal('footer.note');
}
