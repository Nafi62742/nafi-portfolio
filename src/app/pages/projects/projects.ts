import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  computed,
  inject,
  signal
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { Project } from '@models/portfolio.models';
import { InteractiveSceneService, SkylineBuilding } from '@services/interactive-scene.service';
import { PortfolioService } from '@services/portfolio.service';
import { TranslateService } from '@services/translate.service';

/**
 * Projects section component styled as the interactive horizontal-scrolling
 * "The Street" boulevard from devinthehood.com, supporting wheel-to-horizontal
 * scroll, click-and-drag scrolling, skyline parallax, streetlamps, and grid view.
 */
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class ProjectsComponent {
  @ViewChild('streetViewport') public streetViewport?: ElementRef<HTMLElement>;
  @ViewChild('streetSection') public streetSection?: ElementRef<HTMLElement>;

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

  private dragStartX = 0;
  private dragStartScrollLeft = 0;
  private hasDragged = false;

  private readonly portfolio = inject(PortfolioService);
  public readonly t = inject(TranslateService);
  public readonly sceneService = inject(InteractiveSceneService);
  private readonly router = inject(Router);

  /** Skyline buildings loaded from assets/data/interactive-scenes.json. */
  public readonly skylineBuildings = computed<Array<SkylineBuilding>>(() =>
    this.sceneService.config().scenes.skyline.buildings
  );

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
      const el = this.streetViewport?.nativeElement;
      if (el) {
        el.scrollLeft = 0;
        this.updateScrollPct();
      }
    }, 20);
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
    el.scrollTo({ left: 0, behavior: 'smooth' });
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
    el.scrollBy({ left: direction * 460, behavior: 'smooth' });
  }

  /**
   * Updates `scrollPct` whenever the horizontal boulevard scrolls.
   */
  public onViewportScroll(): void {
    this.updateScrollPct();
  }

  /**
   * Converts vertical mouse-wheel scrolling over the boulevard into smooth
   * horizontal scrolling (just like devinthehood.com's #the-street), releasing
   * smoothly to vertical page scroll once the start or end of the street is reached.
   */
  public onViewportWheel(event: WheelEvent): void {
    const el = this.streetViewport?.nativeElement;
    if (!el) {
      return;
    }

    // If user is already scrolling horizontally via trackpad, let native horizontal scroll run
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      return;
    }

    const maxScroll: number = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
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
    el.scrollLeft = this.dragStartScrollLeft - deltaX * 1.3;
    this.updateScrollPct();
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
    el.scrollLeft = (pct / 100) * maxScroll;
    this.scrollPct.set(pct);
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
   * @param name - The project name to slugify
   * @returns A lowercase, hyphenated slug string
   */
  public getSlug(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }

  /**
   * Navigates to the detail page for the given project (ignoring accidental drag releases).
   *
   * @param project - The project to navigate to
   */
  public navigateToProject(project: Project): void {
    if (this.hasDragged) {
      this.hasDragged = false;
      return;
    }
    this.router.navigate(['/project', this.getSlug(project.name)]);
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
    this.scrollPct.set(Math.max(0, Math.min(100, pct)));
  }
}
