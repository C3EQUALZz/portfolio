import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  type ElementRef,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { translateSignal } from '@jsverse/transloco';

/**
 * Modal PDF viewer for a hosted certificate, built on the native `<dialog>`:
 * ESC fires `cancel`, backdrop clicks land on the dialog element itself.
 * The external link is the fallback when the embed fails.
 */
@Component({
  selector: 'app-pdf-viewer-dialog',
  templateUrl: './pdf-viewer-dialog.html',
  styleUrl: './pdf-viewer-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // jsdom (unit tests) never fires `cancel`, so ESC is handled here as well.
  // Backdrop clicks on a modal <dialog> are retargeted to the dialog element.
  host: {
    '(document:keydown.escape)': 'close()',
    '(click)': 'onBackdropClick($event)',
  },
})
export class PdfViewerDialog {
  readonly path = input.required<string>();
  readonly title = input.required<string>();
  readonly closed = output();

  private readonly sanitizer = inject(DomSanitizer);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  /**
   * The path is a local PDF asset: the domain accepts only
   * `certificates/<slug>.pdf` (see certificate.ts), so trusting the
   * resource URL here cannot be turned into a redirect or traversal.
   */
  protected readonly viewerUrl = computed(
    () => this.sanitizer.bypassSecurityTrustResourceUrl(this.path()), // NOSONAR typescript:S6268 — domain-validated local asset, see the doc comment above
  );

  protected readonly closeLabel = translateSignal('certificates.closeViewer');
  protected readonly openExternalLabel = translateSignal('certificates.openExternal');

  constructor() {
    afterRenderEffect(() => {
      const dialog = this.dialog().nativeElement;
      // Detached in unit tests: TestBed never attaches the fixture to a document.
      if (dialog.isConnected && !dialog.open) {
        dialog.showModal();
      }
    });
  }

  close(): void {
    this.closed.emit();
  }

  /** Backdrop clicks on a modal `<dialog>` are retargeted to the dialog itself. */
  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) {
      this.close();
    }
  }
}
