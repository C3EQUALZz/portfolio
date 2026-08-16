import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { provideI18n } from '../../../../core/i18n/provide-i18n';
import { provideCertificatesFeature } from '../../index';
import { CertificatesPage } from './certificates-page';

async function renderPage(): Promise<ComponentFixture<CertificatesPage>> {
  await TestBed.configureTestingModule({
    imports: [CertificatesPage],
    providers: [provideI18n(), provideCertificatesFeature()],
  }).compileComponents();
  const fixture = TestBed.createComponent(CertificatesPage);
  await fixture.whenStable();
  return fixture;
}

describe('CertificatesPage', () => {
  it('renders the three blocks with their certificates', async () => {
    const fixture = await renderPage();
    const element = fixture.nativeElement as HTMLElement;

    const blocks = [...element.querySelectorAll('.block-title')].map((node) =>
      node.textContent.trim(),
    );
    expect(blocks).toEqual(['Professional certifications', 'Courses', 'Hackathons']);
    expect(element.querySelectorAll('.card').length).toBe(10);
  });

  it('opens the PDF viewer when a pdf card is clicked', async () => {
    const fixture = await renderPage();
    const element = fixture.nativeElement as HTMLElement;
    const card = element.querySelector<HTMLButtonElement>('button.card');

    card?.click();
    await fixture.whenStable();

    const dialog = element.querySelector('app-pdf-viewer-dialog');
    expect(dialog).toBeTruthy();
    expect(dialog?.querySelector('iframe')).toBeTruthy();
    expect(dialog?.textContent).toContain('AL-1702');
  });

  it('closes the viewer on the close button and on Escape', async () => {
    const fixture = await renderPage();
    const element = fixture.nativeElement as HTMLElement;

    element.querySelector<HTMLButtonElement>('button.card')?.click();
    await fixture.whenStable();
    element.querySelector<HTMLButtonElement>('.dialog-close')?.click();
    await fixture.whenStable();
    expect(element.querySelector('app-pdf-viewer-dialog')).toBeNull();

    element.querySelector<HTMLButtonElement>('button.card')?.click();
    await fixture.whenStable();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await fixture.whenStable();
    expect(element.querySelector('app-pdf-viewer-dialog')).toBeNull();
  });

  it('renders Stepik entries as external verification links', async () => {
    const fixture = await renderPage();
    const element = fixture.nativeElement as HTMLElement;

    const links = [...element.querySelectorAll<HTMLAnchorElement>('a.card')];
    expect(links).toHaveLength(7);
    expect(links[0]?.href).toContain('https://stepik.org/cert/');
    expect(links[0]?.target).toBe('_blank');
  });
});
