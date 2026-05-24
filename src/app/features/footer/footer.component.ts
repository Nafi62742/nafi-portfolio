import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';

import { ScrollService } from '@services/scroll.service';
import { TranslateService } from '@services/translate.service';

/**
 * Footer component displaying copyright, year, and back-to-top navigation.
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  /** Current calendar year, used in the copyright notice. */
  public readonly year: number = new Date().getFullYear();

  /**
   * @param t - Translation service for i18n labels
   * @param scroll - Scroll service for back-to-top navigation
   */
  constructor(
    @Inject(TranslateService) public readonly t: TranslateService,
    @Inject(ScrollService) public readonly scroll: ScrollService
  ) {}
}
