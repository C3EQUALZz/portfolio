import { ViewportScroller } from '@angular/common';
import { afterEveryRender, ChangeDetectionStrategy, Component, inject } from '@angular/core';
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

  constructor() {
    // Section content loads through async resources, so the router's one-shot
    // anchor scroll fires before the layout is final when arriving from another
    // route (e.g. /certificates -> /#stack). Re-apply the fragment after every
    // render: scrolling itself triggers no renders, so this settles once the
    // content stops growing.
    afterEveryRender(() => {
      const fragment = this.route.snapshot.fragment;
      if (fragment !== null && fragment !== '') {
        this.viewportScroller.scrollToAnchor(fragment);
      }
    });
  }
}
