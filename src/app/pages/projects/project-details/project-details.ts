import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { Project } from '@models/portfolio.models';
import { PortfolioService } from '@services/portfolio.service';
import { AppRoutes } from '@utils/constants';

/**
 * Project detail page component. Loads a project by slug from route params
 * and displays its full details including an interactive screenshot lightbox,
 * architecture breakdown, and an embedded YouTube video.
 */
@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-details.html',
  styleUrl: './project-details.scss'
})
export class ProjectDetailsComponent implements OnInit {
  /** Signal holding the currently loaded project, or null if not yet loaded. */
  public readonly project = signal<Project | null>(null);

  /** Signal holding the sanitized YouTube embed URL, or null if no video. */
  public readonly safeYoutubeUrl = signal<SafeResourceUrl | null>(null);

  /** Signal holding the currently active image index in the lightbox modal, or null when closed. */
  public readonly selectedImageIndex = signal<number | null>(null);

  /**
   * @param route - Activated route for reading URL params
   * @param router - Angular router for navigation and redirects
   * @param portfolioService - Portfolio data service for looking up projects
   * @param sanitizer - DOM sanitizer for creating safe YouTube embed URLs
   */
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly portfolioService = inject(PortfolioService);
  private readonly sanitizer = inject(DomSanitizer);

  /**
   * Global keyboard listener to handle modal escape and arrow key navigation.
   *
   * @param event - Keyboard event
   */
  @HostListener('window:keydown', ['$event'])
  public handleKeydown(event: KeyboardEvent): void {
    if (this.selectedImageIndex() !== null) {
      if (event.key === 'Escape') {
        this.closeLightbox();
      } else if (event.key === 'ArrowRight') {
        this.nextLightboxImage();
      } else if (event.key === 'ArrowLeft') {
        this.prevLightboxImage();
      }
    }
  }

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
          this.router.navigate([AppRoutes.HOME]);
        }
      }
    });
  }

  /**
   * Opens the full-resolution screenshot lightbox at a given image index.
   *
   * @param index - Target screenshot index
   */
  public openLightbox(index: number): void {
    this.selectedImageIndex.set(index);
  }

  /**
   * Closes the active screenshot lightbox.
   */
  public closeLightbox(): void {
    this.selectedImageIndex.set(null);
  }

  /**
   * Closes the screenshot lightbox when clicking the backdrop overlay.
   *
   * @param event - Mouse event from the backdrop
   */
  public onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeLightbox();
    }
  }

  /**
   * Navigates to the next screenshot inside the lightbox.
   */
  public nextLightboxImage(): void {
    const p: Project | null = this.project();
    const curr: number | null = this.selectedImageIndex();
    if (p && p.screenshots && curr !== null) {
      const nextIndex: number = (curr + 1) % p.screenshots.length;
      this.selectedImageIndex.set(nextIndex);
    }
  }

  /**
   * Navigates to the previous screenshot inside the lightbox.
   */
  public prevLightboxImage(): void {
    const p: Project | null = this.project();
    const curr: number | null = this.selectedImageIndex();
    if (p && p.screenshots && curr !== null) {
      const prevIndex: number = (curr - 1 + p.screenshots.length) % p.screenshots.length;
      this.selectedImageIndex.set(prevIndex);
    }
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
   * Navigates back to the projects list page.
   */
  public goBack(): void {
    this.router.navigate(['/' + AppRoutes.PROJECTS]);
  }

  /**
   * Converts a hex colour string to a comma-separated RGB value string.
   *
   * @param hex - A hex colour string (e.g. '#1a2b3c')
   * @returns A comma-separated RGB string (e.g. '26, 43, 60')
   */
  public hexToRgb(hex: string): string {
    const cleanHex: string = hex.replace('#', '');
    const r: number = parseInt(cleanHex.slice(0, 2), 16) || 6;
    const g: number = parseInt(cleanHex.slice(2, 4), 16) || 182;
    const b: number = parseInt(cleanHex.slice(4, 6), 16) || 212;
    return `${r}, ${g}, ${b}`;
  }
}

