import { Injectable, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { filter, throttleTime } from 'rxjs/operators';

import { initRevealObserver } from '@utils/viewport.util';

/**
 * Service that tracks the active scroll section and provides smooth scroll helpers.
 * Also detects navigation back to home from project/publication detail pages.
 */
@Injectable({ providedIn: 'root' })
export class ScrollService {
  /** Signal holding the currently visible section ID. */
  public activeSection = signal<string>('hero');

  /** Signal that is true when the page has been scrolled past 60px. */
  public isScrolled = signal<boolean>(false);

  /** Ordered list of section IDs used for active-section tracking. */
  public readonly sections: Array<string> = [
    'hero', 'about', 'skills', 'experience',
    'projects', 'publications', 'education', 'contact'
  ];

  private previousUrl: string | null = null;
  private currentUrl: string | null = null;

  /**
   * @param router - The Angular router used to listen for navigation events
   */
  private readonly router = inject(Router);

  constructor() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.previousUrl = this.currentUrl;
      this.currentUrl = event.urlAfterRedirects || event.url;

      if (this.currentUrl === '/' || !this.currentUrl) {
        if (this.previousUrl?.startsWith('/project/')) {
          setTimeout(() => {
            requestAnimationFrame(() => {
              this.scrollTo('projects', 'auto');
            });
          }, 300);
        } else if (this.previousUrl?.startsWith('/publication/')) {
          setTimeout(() => {
            requestAnimationFrame(() => {
              this.scrollTo('publications', 'auto');
            });
          }, 300);
        }
      }

      // Initialize scroll reveal observer for the newly active page view
      setTimeout(() => {
        initRevealObserver();
      }, 150);
    });
  }

  /**
   * Attaches a throttled scroll listener that updates isScrolled and activeSection.
   */
  public init(): void {
    fromEvent(window, 'scroll')
      .pipe(throttleTime(100))
      .subscribe(() => {
        this.isScrolled.set(window.scrollY > 60);
        this.updateActive();
      });
  }

  /**
   * Smoothly scrolls the page to the element with the given ID.
   *
   * @param id - The element ID to scroll to
   * @param behavior - Scroll behavior: 'smooth' (default) or 'auto'
   */
  public scrollTo(id: string, behavior: ScrollBehavior = 'smooth'): void {
    const el: HTMLElement | null = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior, block: 'start' });
    }
  }

  /**
   * Updates the activeSection signal based on current scroll position.
   */
  private updateActive(): void {
    const scrollY: number = window.scrollY + 120;
    for (let i: number = this.sections.length - 1; i >= 0; i--) {
      const el: HTMLElement | null = document.getElementById(this.sections[i]);
      if (el && el.offsetTop <= scrollY) {
        this.activeSection.set(this.sections[i]);
        return;
      }
    }
  }
}
