import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { PortfolioService } from '@services/portfolio.service';
import { ScrollService } from '@services/scroll.service';
import { Publication } from '@shared/models/portfolio.models';

/**
 * Publication detail page component. Loads a publication by slug from route params
 * and displays its full abstract, keywords, and external links.
 */
@Component({
  selector: 'app-publication-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './publication-details.component.html',
  styleUrl: './publication-details.component.scss'
})
export class PublicationDetailsComponent implements OnInit {
  /** Signal holding the currently loaded publication, or null if not yet loaded. */
  public readonly publication = signal<Publication | null>(null);

  /**
   * @param route - Activated route for reading URL params
   * @param router - Angular router for navigation and redirects
   * @param portfolioService - Portfolio data service for looking up publications
   * @param scrollService - Scroll service for post-navigation scrolling
   */
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    @Inject(PortfolioService) private readonly portfolioService: PortfolioService,
    @Inject(ScrollService) private readonly scrollService: ScrollService,
  ) {}

  /**
   * Angular lifecycle hook — loads the publication matching the route slug.
   * Redirects to home if the slug does not match any publication.
   */
  public ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug: string | null = params.get('id');
      if (slug) {
        const found: Publication | undefined = this.portfolioService.getPublicationBySlug(slug);
        if (found) {
          this.publication.set(found);
          window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        } else {
          this.router.navigate(['/']);
        }
      }
    });
  }

  /**
   * Navigates back to the home page and scrolls to the publications section.
   */
  public goBack(): void {
    this.router.navigate(['/']).then(() => {
      setTimeout(() => {
        requestAnimationFrame(() => {
          this.scrollService.scrollTo('publications', 'auto');
        });
      }, 300);
    });
  }

  /**
   * Converts a hex colour string to a comma-separated RGB value string.
   *
   * @param hex - A hex colour string (e.g. '#1a2b3c')
   * @returns A comma-separated RGB string (e.g. '26, 43, 60')
   */
  public hexToRgb(hex: string): string {
    const r: number = parseInt(hex.slice(1, 3), 16);
    const g: number = parseInt(hex.slice(3, 5), 16);
    const b: number = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  }
}
