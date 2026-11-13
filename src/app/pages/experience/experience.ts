import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { Experience } from '@models/portfolio.models';
import { PortfolioService } from '@services/portfolio.service';
import { TranslateService } from '@services/translate.service';

/**
 * Grouped company experience entry supporting multiple roles at the same organization.
 */
export interface ExperienceGroup {
  company: string;
  location: string;
  icon: string;
  isCurrent: boolean;
  startDate: string;
  endDate: string | null;
  roles: Array<Experience>;
  combinedTech: Array<string>;
}

/**
 * Experience section component displaying professional work history in reverse-chronological order,
 * grouping roles at the same company with an inline promotion sub-timeline.
 */
@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.html',
  styleUrl: './experience.scss'
})
export class ExperienceComponent {
  /** All experience entries loaded from the portfolio service. */
  public readonly experiences: Array<Experience>;

  /** Experiences grouped by company in reverse-chronological order. */
  public readonly experienceGroups: Array<ExperienceGroup>;

  /**
   * @param portfolio - Portfolio data service providing experience entries
   * @param t - Translation service for i18n labels
   */
  private readonly portfolio: PortfolioService = inject(PortfolioService);
  public readonly t: TranslateService = inject(TranslateService);

  constructor() {
    this.experiences = this.portfolio.getExperiences();
    this.experienceGroups = this.buildGroups(this.experiences);
  }

  /**
   * Groups consecutive roles by company so multi-role tenure is shown in one unified card.
   */
  private buildGroups(items: Array<Experience>): Array<ExperienceGroup> {
    const groups: Array<ExperienceGroup> = [];
    for (const exp of items) {
      const lastGroup: ExperienceGroup | undefined = groups[groups.length - 1];
      if (lastGroup && lastGroup.company === exp.company) {
        lastGroup.roles.push(exp);
        lastGroup.startDate = exp.startDate;
        for (const tech of exp.tech) {
          if (!lastGroup.combinedTech.includes(tech)) {
            lastGroup.combinedTech.push(tech);
          }
        }
      } else {
        groups.push({
          company: exp.company,
          location: exp.location,
          icon: exp.icon,
          isCurrent: exp.endDate === null,
          startDate: exp.startDate,
          endDate: exp.endDate,
          roles: [exp],
          combinedTech: [...exp.tech]
        });
      }
    }
    return groups;
  }

  /**
   * Calculates a formatted duration string between two dates using time as a value.
   *
   * @param startDateStr - Start date in 'MMM YYYY' format (e.g. 'Aug 2023')
   * @param endDateStr - End date in 'MMM YYYY' format, or null for Present
   * @returns Human-readable duration string (e.g. '2 yrs 6 mos', '2 mos')
   */
  public calculateDuration(startDateStr: string, endDateStr: string | null): string {
    const start: Date = this.parseMonthYear(startDateStr);
    const end: Date = endDateStr ? this.parseMonthYear(endDateStr) : new Date();

    const totalMonths: number =
      (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
    const safeMonths: number = Math.max(1, totalMonths);

    const years: number = Math.floor(safeMonths / 12);
    const months: number = safeMonths % 12;

    if (years > 0 && months > 0) {
      return `${years} ${years === 1 ? 'year' : 'years'} ${months} ${months === 1 ? 'month' : 'months'}`;
    } else if (years > 0) {
      return `${years} ${years === 1 ? 'year' : 'years'}`;
    }
    return `${safeMonths} ${safeMonths === 1 ? 'month' : 'months'}`;
  }

  /**
   * Computes the cumulative professional tenure from the earliest role to present.
   *
   * @returns Cumulative tenure duration string
   */
  public getTotalTenure(): string {
    if (this.experiences.length === 0) {
      return '0 months';
    }
    let earliest: Experience = this.experiences[0];
    for (const exp of this.experiences) {
      if (this.parseMonthYear(exp.startDate) < this.parseMonthYear(earliest.startDate)) {
        earliest = exp;
      }
    }
    return this.calculateDuration(earliest.startDate, null);
  }

  /**
   * Parses a 'MMM YYYY' string into a JavaScript Date object.
   *
   * @param str - Date string in 'MMM YYYY' format
   * @returns Parsed Date object
   */
  private parseMonthYear(str: string): Date {
    const monthNames: string[] = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const parts: string[] = str.trim().split(' ');
    const monthIdx: number = monthNames.indexOf(parts[0]);
    const year: number = parseInt(parts[1], 10) || new Date().getFullYear();
    return new Date(year, monthIdx >= 0 ? monthIdx : 0, 1);
  }
}
