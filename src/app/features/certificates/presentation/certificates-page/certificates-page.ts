import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { translateSignal, TranslocoService } from '@jsverse/transloco';

import type {
  CertificateArtifact,
  CertificateCategory,
} from '../../domain/certificate/certificate';

import { CertificatesStore } from '../../application/certificates-store/certificates-store';

import { LocaleService } from '../../../../shared/i18n/locale.service';
import {
  localizedText,
  type LocalizedText,
} from '../../../../shared/kernel/localization/localized-text';
import { PdfViewerDialog } from '../pdf-viewer-dialog/pdf-viewer-dialog';

interface CertificateCard {
  readonly title: string;
  readonly issuer: string;
  readonly issuedText: string;
  readonly artifact: CertificateArtifact;
}

interface CertificateGroupView {
  readonly category: CertificateCategory;
  readonly label: string;
  readonly items: readonly CertificateCard[];
}

/** The certificate open in the modal viewer, if any. */
interface ViewerDocument {
  readonly title: string;
  readonly path: string;
}

/** Certificates page: grouped card grid with a modal PDF viewer. */
@Component({
  selector: 'app-certificates-page',
  imports: [PdfViewerDialog],
  templateUrl: './certificates-page.html',
  styleUrl: './certificates-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificatesPage {
  private readonly store = inject(CertificatesStore);
  private readonly localeService = inject(LocaleService);
  private readonly transloco = inject(TranslocoService);

  protected readonly title = translateSignal('certificates.title');
  protected readonly subtitle = translateSignal('certificates.subtitle');
  protected readonly viewPdfLabel = translateSignal('certificates.viewPdf');
  protected readonly verifyLabel = translateSignal('certificates.verify');

  protected readonly viewer = signal<ViewerDocument | undefined>(undefined);

  protected readonly groups = computed<readonly CertificateGroupView[]>(() =>
    this.store.groups().map((group) => ({
      category: group.category,
      label: this.transloco.translate(`certificates.categories.${group.category}`),
      items: group.certificates.map((item) => ({
        title: this.pick(item.title),
        issuer: this.pick(item.issuer),
        issuedText: this.formatIssued(item.issued),
        artifact: item.artifact,
      })),
    })),
  );

  protected open(card: CertificateCard): void {
    if (card.artifact.kind === 'pdf') {
      this.viewer.set({ title: card.title, path: card.artifact.path });
    }
  }

  protected closeViewer(): void {
    this.viewer.set(undefined);
  }

  private pick(text: LocalizedText): string {
    return localizedText.pick(text, this.localeService.locale());
  }

  private formatIssued(issued: string): string {
    const year = Number(issued.slice(0, 4));
    const month = Number(issued.slice(5, 7));
    const tag = this.localeService.locale() === 'ru' ? 'ru-RU' : 'en-US';
    return new Intl.DateTimeFormat(tag, { month: 'long', year: 'numeric' }).format(
      new Date(year, month - 1),
    );
  }
}
