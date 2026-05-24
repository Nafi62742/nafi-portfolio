import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { PortfolioService } from '@services/portfolio.service';
import { TranslateService } from '@services/translate.service';
import { Project } from '@shared/models/portfolio.models';

/**
 * Projects section component displaying a grid of portfolio project cards.
 */
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  /** All projects loaded from the portfolio service. */
  public readonly projects: Array<Project>;

  /**
   * @param t - Translation service for i18n labels
   * @param portfolio - Portfolio data service providing project entries
   * @param router - Angular router for navigating to project detail pages
   */
  constructor(
    @Inject(TranslateService) public readonly t: TranslateService,
    @Inject(PortfolioService) private readonly portfolio: PortfolioService,
    private readonly router: Router
  ) {
    this.projects = this.portfolio.getProjects();
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
