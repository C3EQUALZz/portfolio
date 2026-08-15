import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Hero } from './features/resume';
import { Footer } from './shell/footer';
import { Header } from './shell/header';

@Component({
  selector: 'app-root',
  imports: [Header, Hero, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
