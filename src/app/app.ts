import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ContactSection } from './features/contact';
import { ProjectsSection } from './features/projects';
import { AboutSection, ExperienceSection, Hero, StackSection } from './features/resume';
import { Footer } from './shell/footer';
import { Header } from './shell/header';

@Component({
  selector: 'app-root',
  imports: [
    Header,
    Hero,
    AboutSection,
    ExperienceSection,
    ProjectsSection,
    StackSection,
    ContactSection,
    Footer,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
