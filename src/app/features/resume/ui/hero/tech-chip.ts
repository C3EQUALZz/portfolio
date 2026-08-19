import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * One chip of the hero technology ring: a brand logo, a phosphor fallback
 * or the plain name when the technology has neither. Purely presentational.
 */
@Component({
  selector: 'app-tech-chip',
  imports: [NgOptimizedImage],
  templateUrl: './tech-chip.html',
  styleUrl: './tech-chip.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechChip {
  readonly name = input.required<string>();
  readonly size = input.required<number>();
  readonly assetPath = input<string>();
  readonly phIcon = input<string>();
}
