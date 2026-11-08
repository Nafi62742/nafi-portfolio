import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { Project } from '@models/portfolio.models';
import { PortfolioService } from '@services/portfolio.service';
import { TranslateService } from '@services/translate.service';
import { initRevealObserver } from '@utils/viewport.util';

/**
 * Projects section component displaying a grid of portfolio project cards.
 */
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class ProjectsComponent {
  /** Number of featured projects displayed initially before expanding. */
  public readonly initialCount: number = 6;

  /** Signal controlling whether all projects or only the top featured ones are shown. */
  public readonly showAll = signal<boolean>(false);

  /** All projects loaded from the portfolio service. */
  public readonly projects: Array<Project>;

  /**
   * @param t - Translation service for i18n labels
   * @param portfolio - Portfolio data service providing project entries
   * @param router - Angular router for navigating to project detail pages
   */
  private readonly portfolio = inject(PortfolioService);
  public readonly t = inject(TranslateService);
  private readonly router = inject(Router);

  constructor() {
    this.projects = this.portfolio.getProjects();
  }

  /**
   * Returns the subset of projects currently visible based on the toggle state.
   */
  public get visibleProjects(): Array<Project> {
    return this.showAll() ? this.projects : this.projects.slice(0, this.initialCount);
  }

  /**
   * Toggles between showing the top 6 featured projects and all projects.
   */
  public toggleShowAll(): void {
    this.showAll.update((v: boolean) => !v);
    if (this.showAll()) {
      setTimeout(() => initRevealObserver(), 50);
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
