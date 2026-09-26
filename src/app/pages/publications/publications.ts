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

  /**
   * Converts a 6-digit hex color string to comma-separated RGB values.
   *
   * @param hex - Hex color string (e.g. '#6366f1')
   * @returns Comma-separated RGB channels (e.g. '99, 102, 241')
   */
  public hexToRgb(hex: string): string {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `${r}, ${g}, ${b}`;
  }

  /**
   * Identifies the publication type category based on venue description.
   *
   * @param venue - Venue string from publication metadata
   * @returns Clean category badge label
   */
  public getPublicationType(venue: string): string {
    if (venue.toLowerCase().includes('ieee') || venue.toLowerCase().includes('conference')) {
      return 'IEEE Conference Paper';
    }
    return 'Journal Article';
  }
}
