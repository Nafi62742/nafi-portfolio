import { Injectable, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { filter, throttleTime } from 'rxjs/operators';

import { initRevealObserver } from '@utils/viewport.util';

/** Blueprint chapter node representation for the cyber minimap elevator. */
export interface MinimapNode {
  id: string;
  index: string;
  label: string;
  code: string;
  icon: string;
}

/** 7 architecture chapters mapped to blueprint minimap coordinates. */
export const MINIMAP_NODES: Array<MinimapNode> = [
  { id: 'hero',         index: '01', label: 'Overview',     code: 'INIT', icon: 'fa-terminal' },
  { id: 'about',        index: '02', label: 'Architecture', code: 'ARCH', icon: 'fa-microchip' },
  { id: 'experience',   index: '03', label: 'Experience',   code: 'WORK', icon: 'fa-briefcase' },
  { id: 'projects',     index: '04', label: 'Projects',     code: 'PROD', icon: 'fa-layer-group' },
  { id: 'publications', index: '05', label: 'Research',     code: 'RSCH', icon: 'fa-book-bookmark' },
  { id: 'education',    index: '06', label: 'Credentials',  code: 'CRED', icon: 'fa-graduation-cap' },
  { id: 'contact',      index: '07', label: 'Contact',      code: 'MAIL', icon: 'fa-paper-plane' }
];

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

  /** Signal holding normalized scroll progress (0 to 1). */
  public scrollProgress = signal<number>(0);

  /** Transient HUD banner shown briefly during section transitions. */
  public transitionHud = signal<{ index: string; label: string } | null>(null);

  /** Ordered list of section IDs used for active-section tracking. */
  public readonly sections: Array<string> = [
    'hero', 'about', 'skills', 'experience',
    'projects', 'runmate', 'publications', 'education', 'contact'
  ];

  /** Currently active minimap node computed from active section. */
  public readonly activeNode = computed<MinimapNode>(() => {
    const sec: string = this.activeSection();
    if (sec === 'skills') {
      return MINIMAP_NODES[1];
    }
    if (sec === 'runmate') {
      return MINIMAP_NODES[3];
    }
    const found: MinimapNode | undefined = MINIMAP_NODES.find((n: MinimapNode) => n.id === sec);
    return found ?? MINIMAP_NODES[0];
  });

  private readonly sectionMeta: Record<string, { index: string; label: string }> = {
    hero:         { index: '01', label: 'OVERVIEW' },
    about:        { index: '02', label: 'ARCHITECTURE' },
    skills:       { index: '02', label: 'TECHNICAL SKILLS' },
    experience:   { index: '03', label: 'WORK EXPERIENCE' },
    projects:     { index: '04', label: 'FEATURED PROJECTS' },
    runmate:      { index: '04', label: 'RUNMATE ECOSYSTEM' },
    publications: { index: '05', label: 'RESEARCH & PUBLICATIONS' },
    education:    { index: '06', label: 'EDUCATION & CREDENTIALS' },
    contact:      { index: '07', label: 'CONTACT' }
  };

  private hudTimer: ReturnType<typeof setTimeout> | null = null;

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
      .pipe(throttleTime(50))
      .subscribe(() => {
        this.isScrolled.set(window.scrollY > 60);
        this.updateActive();
        const maxScroll: number = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const ratio: number = Math.min(1, Math.max(0, window.scrollY / maxScroll));
        this.scrollProgress.set(ratio);
        document.documentElement.style.setProperty('--scroll-ratio', ratio.toFixed(4));
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
    if (!el) {
      return;
    }
    this.showTransitionHud(id);
    const docWithVT = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };
    if (behavior === 'auto' && typeof docWithVT.startViewTransition === 'function') {
      docWithVT.startViewTransition(() => {
        el.scrollIntoView({ behavior, block: 'start' });
      });
    } else {
      el.scrollIntoView({ behavior, block: 'start' });
    }
  }

  /**
   * Updates the activeSection signal based on current scroll position.
   */
  private updateActive(): void {
    const scrollY: number = window.scrollY + 140;
    for (let i: number = this.sections.length - 1; i >= 0; i--) {
      const el: HTMLElement | null = document.getElementById(this.sections[i]);
      if (el && el.offsetTop <= scrollY) {
        const nextId = this.sections[i];
        if (this.activeSection() !== nextId) {
          this.activeSection.set(nextId);
          this.showTransitionHud(nextId);
        }
        return;
      }
    }
  }

  private showTransitionHud(id: string): void {
    const meta = this.sectionMeta[id];
    if (!meta) {
      return;
    }
    this.transitionHud.set(meta);
    if (this.hudTimer) {
      clearTimeout(this.hudTimer);
    }
    this.hudTimer = setTimeout(() => {
      this.transitionHud.set(null);
    }, 1350);
  }
}
