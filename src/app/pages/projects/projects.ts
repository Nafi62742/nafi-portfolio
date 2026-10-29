import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { Project } from '@models/portfolio.models';
import { InteractiveSceneService, SkylineBuilding } from '@services/interactive-scene.service';
import { PortfolioService } from '@services/portfolio.service';
import { TranslateService } from '@services/translate.service';

/**
 * Projects section component displaying portfolio project cards
 * styled as the interactive "The Street" boulevard from devinthehood.com,
 * with JSON-driven skyline silhouettes, streetlamps, horizontal street stroll, and grid mode.
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

  /** All projects loaded from the portfolio service. */
  public readonly projects: Array<Project>;

  /** Currently active category filter ('all', 'office', or 'personal'). */
  public activeFilter: 'all' | 'office' | 'personal' = 'all';

  /** View mode: 'street' (horizontal interactive boulevard like devinthehood) or 'grid' (all-shops grid). */
  public readonly viewMode = signal<'street' | 'grid'>('street');

  /** Whether streetlamps along the boulevard are lit. */
  public readonly lampsLit = signal<boolean>(true);

  private readonly portfolio = inject(PortfolioService);
  public readonly t = inject(TranslateService);
  public readonly sceneService = inject(InteractiveSceneService);
  private readonly router = inject(Router);

  /** Skyline buildings loaded from assets/data/interactive-scenes.json. */
  public readonly skylineBuildings = computed<Array<SkylineBuilding>>(() =>
    this.sceneService.config().scenes.skyline.buildings
  );

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
   * Sets the active project category filter.
   *
   * @param filter - Category filter to apply
   */
  public setFilter(filter: 'all' | 'office' | 'personal'): void {
    this.activeFilter = filter;
  }

  /**
   * Switches between interactive horizontal Boulevard ('street') and full Grid ('grid') view.
   */
  public setViewMode(mode: 'street' | 'grid'): void {
    this.viewMode.set(mode);
  }

  /**
   * Toggles the streetlamps along the boulevard on/off.
   */
  public toggleLamps(): void {
    this.lampsLit.update((v: boolean) => !v);
  }

  /**
   * Scrolls the horizontal boulevard viewport left or right.
   *
   * @param direction - -1 for left, 1 for right
   */
  public strollStreet(direction: -1 | 1): void {
    const el = this.streetViewport?.nativeElement;
    if (!el) {
      return;
    }
    el.scrollBy({ left: direction * 440, behavior: 'smooth' });
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
   * Navigates to the detail page for the given project.
   *
   * @param project - The project to navigate to
   */
  public navigateToProject(project: Project): void {
    this.router.navigate(['/project', this.getSlug(project.name)]);
  }
}
