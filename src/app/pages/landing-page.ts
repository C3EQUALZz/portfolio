import { ViewportScroller } from '@angular/common';
import {
  afterNextRender,
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ContactSection } from '../features/contact';
import { ProjectsSection } from '../features/projects';
import {
  AboutSection,
  EducationSection,
  ExperienceSection,
  Hero,
  StackSection,
} from '../features/resume';

/** The single-page resume landing, served at `/`. */
@Component({
  selector: 'app-landing-page',
  imports: [
    Hero,
    AboutSection,
    ExperienceSection,
    ProjectsSection,
    StackSection,
    EducationSection,
    ContactSection,
  ],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPage {
  private readonly route = inject(ActivatedRoute);
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly application = inject(ApplicationRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    // The initial anchor needs the final layout of the async feature resources.
    // Later UI renders must preserve the reader's position; the router handles
    // subsequent fragment navigation once the landing content has loaded.
    afterNextRender(() => {
      void this.application.whenStable().then(() => {
        const fragment = this.route.snapshot.fragment;
        if (!this.destroyRef.destroyed && fragment !== null && fragment !== '') {
          this.viewportScroller.scrollToAnchor(fragment);
        }
      });
    });
  }
}
