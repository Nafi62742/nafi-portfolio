import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { Experience } from '@models/portfolio.models';
import { PortfolioService } from '@services/portfolio.service';
import { TranslateService } from '@services/translate.service';

/**
 * Experience section component displaying professional work history,
 * highlighting the career progression and transition from Intern to Full-time Software Developer.
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

  /**
   * @param portfolio - Portfolio data service providing experience entries
   * @param t - Translation service for i18n labels
   */
  private readonly portfolio: PortfolioService = inject(PortfolioService);
  public readonly t: TranslateService = inject(TranslateService);

  constructor() {
    this.experiences = this.portfolio.getExperiences();
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
      return `${years} ${years === 1 ? 'yr' : 'yrs'} ${months} ${months === 1 ? 'mo' : 'mos'}`;
    } else if (years > 0) {
      return `${years} ${years === 1 ? 'yr' : 'yrs'}`;
    }
    return `${safeMonths} ${safeMonths === 1 ? 'mo' : 'mos'}`;
  }

  /**
   * Computes the cumulative professional tenure from the earliest role to present.
   *
   * @returns Cumulative tenure duration string
   */
  public getTotalTenure(): string {
    if (this.experiences.length === 0) {
      return '0 mos';
    }
    const earliestRole: Experience = this.experiences[this.experiences.length - 1];
    return this.calculateDuration(earliestRole.startDate, null);
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
