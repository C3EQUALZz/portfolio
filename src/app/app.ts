import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Footer } from './shell/footer';
import { Header } from './shell/header';

@Component({
  selector: 'app-root',
  imports: [Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
