import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
  computed,
  inject,
  signal
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { Project } from '@models/portfolio.models';
import {
  InteractiveSceneService,
  SkylineBuilding,
  SportsCarScene
} from '@services/interactive-scene.service';
import { PortfolioService } from '@services/portfolio.service';
import { TranslateService } from '@services/translate.service';

/**
 * Projects section component styled as the interactive horizontal-scrolling
 * "The Street" boulevard from devinthehood.com, featuring a sticky vertical-to-horizontal
 * scroll runway lock, a JSON-driven right-side R-007 sports car driving across the
 * skyline with spinning wheels, and slightly rounded storefront cards.
 */
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class ProjectsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('streetViewport') public streetViewport?: ElementRef<HTMLElement>;
  @ViewChild('streetSection') public streetSection?: ElementRef<HTMLElement>;
  @ViewChild('streetSticky') public streetSticky?: ElementRef<HTMLElement>;

  /** All projects loaded from the portfolio service. */
  public readonly projects: Array<Project>;

  /** Currently active category filter ('all', 'office', or 'personal'). */
  public activeFilter: 'all' | 'office' | 'personal' = 'all';

  /** Whether streetlamps along the boulevard are lit. */
  public readonly lampsLit = signal<boolean>(true);

  /** Horizontal scroll progress (0 to 100) along the street boulevard. */
  public readonly scrollPct = signal<number>(0);

  /** Whether the user is currently click-dragging the horizontal boulevard. */
  public readonly isDragging = signal<boolean>(false);

  /** Total height (in px) of the sticky scroll runway so vertical scroll drives horizontal scroll. */
  public readonly runwayHeightPx = signal<number | null>(null);

  /** Shop index (0..N-1) where the daily Easter-egg cat sits by the door (devinthehood pattern). */
  public readonly catShopIdx = signal<number>(0);

  private dragStartX = 0;
  private dragStartScrollLeft = 0;
  private hasDragged = false;
  private syncingFromWindowScroll = false;
  private resizeTimer?: ReturnType<typeof setTimeout>;

  private readonly portfolio = inject(PortfolioService);
  public readonly t = inject(TranslateService);
  public readonly sceneService = inject(InteractiveSceneService);
  private readonly router = inject(Router);

  /** Skyline buildings loaded from assets/data/interactive-scenes.json. */
  public readonly skylineBuildings = computed<Array<SkylineBuilding>>(() =>
    this.sceneService.config().scenes.skyline.buildings
  );

  /** Right-side sports car geometry loaded from assets/data/interactive-scenes.json. */
  public readonly sportsCar = computed<SportsCarScene>(() =>
    this.sceneService.config().scenes.sportsCar
  );

  /** Wheel rotation angle in degrees driven by horizontal scroll progress. */
  public readonly carWheelDeg = computed<number>(() => Math.round(this.scrollPct() * 18));

  /** Simulated KM/H speed readout based on horizontal scroll progress. */
  public readonly carSpeedKmh = computed<number>(() => {
    const pct = this.scrollPct();
    if (pct <= 0 || pct >= 100) {
      return 0;
    }
    return Math.min(312, 68 + Math.round(pct * 2.2));
  });

  /** Simulated 6-speed sequential gearbox readout based on scroll progress. */
  public readonly currentGear = computed<string>(() => {
    const pct = this.scrollPct();
    if (pct <= 0) {
      return 'N';
    }
    return String(Math.min(6, Math.floor(pct / 17) + 1));
  });

  /** Current active shop number (1..N) based on horizontal scroll progress. */
  public readonly currentShopIndex = computed<number>(() => {
    const total: number = Math.max(1, this.filteredProjects.length);
    const idx: number = Math.round((this.scrollPct() / 100) * (total - 1)) + 1;
    return Math.min(total, Math.max(1, idx));
  });

  /** Parallax X offset in pixels for the skyline silhouette. */
  public readonly skylineParallaxX = computed<number>(() => -Math.round(this.scrollPct() * 1.4));

  /** Parallax X offset in pixels for the sun/moon orb. */
  public readonly sunParallaxX = computed<number>(() => -Math.round(this.scrollPct() * 0.45));

  constructor() {
    this.projects = this.portfolio.getProjects();
    const daySeed = Math.floor(Date.now() / 86400000);
    this.catShopIdx.set(this.projects.length > 0 ? daySeed % this.projects.length : 0);
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.recalculateRunway();
      this.onWindowScroll();
    }, 120);
  }

  public ngOnDestroy(): void {
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
  }

  /**
   * Returns the projects matching the active category filter.
   */
  public get filteredProjects(): Array<Project> {
    if (this.activeFilter === 'all') {
      return this.projects;
    }
    return this.projects.filter((p: Project) =>
      this.activeFilter === 'office' ? p.category === 'office' : p.category !== 'office'
    );
  }

  /**
   * Sets the active project category filter and resets scroll position.
   *
   * @param filter - Category filter to apply
   */
  public setFilter(filter: 'all' | 'office' | 'personal'): void {
    this.activeFilter = filter;
    setTimeout(() => {
      this.recalculateRunway();
      this.scrollToStreetStart();
    }, 30);
  }

  /**
   * Toggles the streetlamps along the boulevard on/off.
   */
  public toggleLamps(): void {
    this.lampsLit.update((v: boolean) => !v);
  }

  /**
   * Smoothly scrolls the horizontal boulevard back to the very first storefront.
   */
  public scrollToStreetStart(): void {
    const el = this.streetViewport?.nativeElement;
    if (!el) {
      return;
    }
    if (this.runwayHeightPx() !== null && this.streetSection?.nativeElement) {
      const sectionTop = this.streetSection.nativeElement.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: Math.max(0, sectionTop - 68), behavior: 'smooth' });
    } else {
      el.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }

  /**
   * Scrolls the horizontal boulevard viewport left or right by one storefront width.
   *
   * @param direction - -1 for left, 1 for right
   */
  public strollStreet(direction: -1 | 1): void {
    const el = this.streetViewport?.nativeElement;
    if (!el) {
      return;
    }
    const delta = direction * 440;
    if (this.runwayHeightPx() !== null && this.streetSection?.nativeElement) {
      window.scrollBy({ top: delta, behavior: 'smooth' });
    } else {
      el.scrollBy({ left: delta, behavior: 'smooth' });
    }
  }

  /**
   * Recalculates the vertical sticky runway height so vertical page scrolling
   * drives the entire horizontal boulevard from 0% to 100% before unpinning.
   */
  @HostListener('window:resize')
  public onWindowResize(): void {
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
    this.resizeTimer = setTimeout(() => {
      this.recalculateRunway();
      this.onWindowScroll();
    }, 100);
  }

  /**
   * Syncs vertical window scroll inside `.street` into horizontal `scrollLeft`
   * so the user scrolls through the entire street horizontally before reaching the next section.
   */
  @HostListener('window:scroll')
  public onWindowScroll(): void {
    const sectionEl = this.streetSection?.nativeElement;
    const stickyEl = this.streetSticky?.nativeElement;
    const viewportEl = this.streetViewport?.nativeElement;
    if (!sectionEl || !stickyEl || !viewportEl || this.runwayHeightPx() === null) {
      return;
    }

    const maxScroll = Math.max(0, viewportEl.scrollWidth - viewportEl.clientWidth);
    if (maxScroll <= 0) {
      return;
    }

    const rect = sectionEl.getBoundingClientRect();
    const stickyOffset = 68;
    const runwayTravel = Math.max(1, sectionEl.offsetHeight - stickyEl.offsetHeight);
    const rawScrolled = stickyOffset - rect.top;
    const clampedScrolled = Math.min(runwayTravel, Math.max(0, rawScrolled));
    const progressRatio = clampedScrolled / runwayTravel;

    this.syncingFromWindowScroll = true;
    viewportEl.scrollLeft = progressRatio * maxScroll;
    this.scrollPct.set(Math.min(100, Math.max(0, Math.round(progressRatio * 100))));
    setTimeout(() => {
      this.syncingFromWindowScroll = false;
    }, 0);
  }

  /**
   * Updates `scrollPct` whenever the horizontal boulevard scrolls directly.
   */
  public onViewportScroll(): void {
    if (this.syncingFromWindowScroll) {
      return;
    }
    this.updateScrollPct();
  }

  /**
   * Converts vertical or horizontal mouse-wheel scrolling over the boulevard into
   * smooth progress along the sticky runway (or horizontal scroll on mobile).
   */
  public onViewportWheel(event: WheelEvent): void {
    const el = this.streetViewport?.nativeElement;
    if (!el) {
      return;
    }

    const maxScroll: number = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      return;
    }

    // If sticky runway is active, translate horizontal trackpad swipe into vertical window scroll
    if (this.runwayHeightPx() !== null) {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        const atStart: boolean = el.scrollLeft <= 2;
        const atEnd: boolean = el.scrollLeft >= maxScroll - 2;
        if ((event.deltaX < 0 && !atStart) || (event.deltaX > 0 && !atEnd)) {
          event.preventDefault();
          window.scrollBy({ top: event.deltaX, behavior: 'auto' });
        }
      }
      return;
    }

    const atStart: boolean = el.scrollLeft <= 2;
    const atEnd: boolean = el.scrollLeft >= maxScroll - 2;

    if ((event.deltaY < 0 && !atStart) || (event.deltaY > 0 && !atEnd)) {
      event.preventDefault();
      el.scrollLeft += event.deltaY * 1.15;
      this.updateScrollPct();
    }
  }

  /**
   * Starts mouse click-and-drag scrolling on the horizontal boulevard.
   */
  public onDragStart(event: MouseEvent): void {
    if (event.button !== 0) {
      return;
    }
    const el = this.streetViewport?.nativeElement;
    if (!el) {
      return;
    }
    this.isDragging.set(true);
    this.hasDragged = false;
    this.dragStartX = event.pageX;
    this.dragStartScrollLeft = el.scrollLeft;
  }

  /**
   * Handles mouse movement during click-and-drag scrolling.
   */
  @HostListener('window:mousemove', ['$event'])
  public onDragMove(event: MouseEvent): void {
    if (!this.isDragging()) {
      return;
    }
    const el = this.streetViewport?.nativeElement;
    if (!el) {
      return;
    }
    const deltaX: number = event.pageX - this.dragStartX;
    if (Math.abs(deltaX) > 6) {
      this.hasDragged = true;
    }
    const targetLeft = this.dragStartScrollLeft - deltaX * 1.3;
    if (this.runwayHeightPx() !== null && this.streetSection?.nativeElement) {
      const sectionTop = this.streetSection.nativeElement.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: Math.max(0, sectionTop - 68 + targetLeft), behavior: 'auto' });
    } else {
      el.scrollLeft = targetLeft;
      this.updateScrollPct();
    }
  }

  /**
   * Ends mouse click-and-drag scrolling.
   */
  @HostListener('window:mouseup')
  public onDragEnd(): void {
    if (this.isDragging()) {
      this.isDragging.set(false);
    }
  }

  /**
   * Scrubs the horizontal boulevard to a specific percentage (0..100) via the range slider.
   */
  public onScrubInput(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const el = this.streetViewport?.nativeElement;
    if (!input || !el) {
      return;
    }
    const pct: number = Number(input.value);
    const maxScroll: number = el.scrollWidth - el.clientWidth;
    const targetLeft = (pct / 100) * maxScroll;

    if (this.runwayHeightPx() !== null && this.streetSection?.nativeElement) {
      const sectionTop = this.streetSection.nativeElement.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: Math.max(0, sectionTop - 68 + targetLeft), behavior: 'auto' });
    } else {
      el.scrollLeft = targetLeft;
      this.scrollPct.set(pct);
    }
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

  /**
   * Converts a project name to a URL-safe slug.
   *
   * @param name - The project name
   * @returns URL-safe slug string
   */
  public getSlug(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }

  /**
   * Navigates to the detail page for the given project (ignoring drag release).
   *
   * @param project - The project to view
   */
  public navigateToProject(project: Project): void {
    if (this.hasDragged) {
      this.hasDragged = false;
      return;
    }
    void this.router.navigate(['/project', this.getSlug(project.name)]);
  }

  private recalculateRunway(): void {
    if (typeof window === 'undefined') {
      return;
    }
    const viewportEl = this.streetViewport?.nativeElement;
    const stickyEl = this.streetSticky?.nativeElement;
    if (!viewportEl || !stickyEl || window.innerWidth <= 768) {
      this.runwayHeightPx.set(null);
      return;
    }
    const maxScroll = Math.max(0, viewportEl.scrollWidth - viewportEl.clientWidth);
    if (maxScroll <= 20) {
      this.runwayHeightPx.set(null);
      return;
    }
    this.runwayHeightPx.set(stickyEl.offsetHeight + maxScroll);
  }

  private updateScrollPct(): void {
    const el = this.streetViewport?.nativeElement;
    if (!el) {
      return;
    }
    const maxScroll: number = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      this.scrollPct.set(0);
      return;
    }
    const pct: number = Math.round((el.scrollLeft / maxScroll) * 100);
    this.scrollPct.set(Math.min(100, Math.max(0, pct)));
  }
}
