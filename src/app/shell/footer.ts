import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TranslocoPipe } from '@jsverse/transloco';

/** Footer frame; the contact CTA fills it in the contact slice. */
@Component({
  selector: 'app-footer',
  imports: [TranslocoPipe],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {}
