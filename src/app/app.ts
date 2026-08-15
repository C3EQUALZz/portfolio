import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AboutSection, ExperienceSection, Hero, StackSection } from './features/resume';
import { Footer } from './shell/footer';
import { Header } from './shell/header';

@Component({
  selector: 'app-root',
  imports: [Header, Hero, AboutSection, ExperienceSection, StackSection, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
