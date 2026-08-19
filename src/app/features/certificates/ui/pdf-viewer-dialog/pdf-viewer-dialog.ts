import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { translateSignal } from '@jsverse/transloco';

/**
 * Modal PDF viewer for a hosted certificate. Closes on ESC and on overlay
 * click; the external link is the fallback when the embed fails.
 */
@Component({
  selector: 'app-pdf-viewer-dialog',
  templateUrl: './pdf-viewer-dialog.html',
  styleUrl: './pdf-viewer-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'close()' },
})
export class PdfViewerDialog {
  readonly path = input.required<string>();
  readonly title = input.required<string>();
  readonly closed = output();

  private readonly sanitizer = inject(DomSanitizer);

  /**
   * The path is a local PDF asset: the domain accepts only
   * `certificates/<slug>.pdf` (see certificate.ts), so trusting the
   * resource URL here cannot be turned into a redirect or traversal.
   */
  protected readonly viewerUrl = computed(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(this.path()),
  );

  protected readonly closeLabel = translateSignal('certificates.closeViewer');
  protected readonly openExternalLabel = translateSignal('certificates.openExternal');

  close(): void {
    this.closed.emit();
  }
}
