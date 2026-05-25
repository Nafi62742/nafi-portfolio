import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Publication } from '@models/portfolio.models';
import { PortfolioService } from '@services/portfolio.service';
import { TranslateService } from '@services/translate.service';

/**
 * Publications section component displaying research and publication cards.
 */
@Component({
  selector: 'app-publications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './publications.html',
  styleUrl: './publications.scss'
})
export class PublicationsComponent {
  /** All publications loaded from the portfolio service. */
  public readonly publications: Array<Publication>;

  /**
   * @param t - Translation service for i18n labels
   * @param portfolio - Portfolio data service providing publication entries
   */
  private readonly portfolio = inject(PortfolioService);
  public readonly t = inject(TranslateService);

  constructor() {
    this.publications = this.portfolio.getPublications();
  }

  /**
   * Converts a publication title to a URL-safe slug.
   *
   * @param title - The publication title to slugify
   * @returns A lowercase, hyphenated slug string
   */
  public toSlug(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
}
