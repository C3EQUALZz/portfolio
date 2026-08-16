import { ChangeDetectionStrategy, Component } from '@angular/core';

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
export class LandingPage {}
