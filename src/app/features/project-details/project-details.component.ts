import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { PortfolioService } from '@services/portfolio.service';
import { ScrollService } from '@services/scroll.service';
import { Project } from '@shared/models/portfolio.models';

/**
 * Project detail page component. Loads a project by slug from route params
 * and displays its full details including screenshots and an embedded YouTube video.
 */
@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent implements OnInit {
  /** Signal holding the currently loaded project, or null if not yet loaded. */
  public readonly project = signal<Project | null>(null);

  /** Signal holding the sanitized YouTube embed URL, or null if no video. */
  public readonly safeYoutubeUrl = signal<SafeResourceUrl | null>(null);

  /**
   * @param route - Activated route for reading URL params
   * @param router - Angular router for navigation and redirects
   * @param portfolioService - Portfolio data service for looking up projects
   * @param scrollService - Scroll service for post-navigation scrolling
   * @param sanitizer - DOM sanitizer for creating safe YouTube embed URLs
   */
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    @Inject(PortfolioService) private readonly portfolioService: PortfolioService,
    @Inject(ScrollService) private readonly scrollService: ScrollService,
    private readonly sanitizer: DomSanitizer
  ) {}

  /**
   * Angular lifecycle hook — loads the project matching the route slug.
   * Redirects to home if the slug does not match any project.
   */
  public ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug: string | null = params.get('id');
      if (slug) {
        const foundProject: Project | undefined = this.portfolioService.getProjectBySlug(slug);
        if (foundProject) {
          this.project.set(foundProject);
          if (foundProject.youtube) {
            const safeUrl: SafeResourceUrl | undefined = this.getSafeYoutubeUrl(foundProject.youtube);
            if (safeUrl) {
              this.safeYoutubeUrl.set(safeUrl);
            }
          } else {
            this.safeYoutubeUrl.set(null);
          }
          window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        } else {
          this.router.navigate(['/']);
        }
      }
    });
  }

  /**
   * Extracts the YouTube video ID from a URL and returns a sanitized embed URL.
   *
   * @param url - A YouTube video URL in any common format
   * @returns A sanitized SafeResourceUrl for embedding, or undefined if the URL is invalid
   */
  public getSafeYoutubeUrl(url: string): SafeResourceUrl | undefined {
    const regExp: RegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match: RegExpMatchArray | null = url.match(regExp);
    if (match && match[2].length === 11) {
      const videoId: string = match[2];
      return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
    }
    return undefined;
  }

  /**
   * Navigates back to the home page and scrolls to the projects section.
   */
  public goBack(): void {
    this.router.navigate(['/']).then(() => {
      setTimeout(() => {
        requestAnimationFrame(() => {
          this.scrollService.scrollTo('projects', 'auto');
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
