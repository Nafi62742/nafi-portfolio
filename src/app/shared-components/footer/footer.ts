
import { Component, inject } from '@angular/core';

import { ScrollService } from '@services/scroll.service';
import { TranslateService } from '@services/translate.service';

/**
 * Footer component displaying copyright, year, and back-to-top navigation.
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class FooterComponent {
  /** Current calendar year, used in the copyright notice. */
  public readonly year: number = new Date().getFullYear();

  /**
   * @param t - Translation service for i18n labels
   * @param scroll - Scroll service for back-to-top navigation
   */
  public readonly t = inject(TranslateService);
  public readonly scroll = inject(ScrollService);
}
