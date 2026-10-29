import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import { Experience } from '@models/portfolio.models';
import { FactoryGear, FactoryPiston, InteractiveSceneService } from '@services/interactive-scene.service';
import { PortfolioService } from '@services/portfolio.service';
import { TranslateService } from '@services/translate.service';

/**
 * Experience section component styled as the interactive "The Factory"
 * assembly line from devinthehood.com, complete with JSON-driven rotating gears,
 * hydraulic press stamping, conveyor belt rollers, and raw/shipped crate inspection.
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

  /** Whether the hydraulic press is currently mid-stamp animation. */
  public readonly isPressing = signal<boolean>(false);

  /** Whether crates are displayed in Raw Blueprint Wireframe mode vs Shipped mode. */
  public readonly isRawBlueprint = signal<boolean>(false);

  /** Number of conveyor belt rollers to render. */
  public readonly rollers: Array<number> = Array.from({ length: 18 }, (_, i) => i);

  private readonly portfolio: PortfolioService = inject(PortfolioService);
  public readonly t: TranslateService = inject(TranslateService);
  public readonly sceneService: InteractiveSceneService = inject(InteractiveSceneService);

  /** Rotating factory gears loaded from assets/data/interactive-scenes.json. */
  public readonly gears = computed<Array<FactoryGear>>(() =>
    this.sceneService.config().scenes.factory.gears
  );

  /** Animated factory pistons loaded from assets/data/interactive-scenes.json. */
  public readonly pistons = computed<Array<FactoryPiston>>(() =>
    this.sceneService.config().scenes.factory.pistons
  );

  constructor() {
    this.experiences = this.portfolio.getExperiences();
  }

  /**
   * Cycles the hydraulic press down and toggles/stamps the crates between
   * Raw Wireframe and Shipped Production state.
   */
  public cycleHydraulicPress(): void {
    if (this.isPressing()) {
      return;
    }
    this.isPressing.set(true);
    setTimeout(() => {
      this.isRawBlueprint.update((v: boolean) => !v);
    }, 260);
    setTimeout(() => {
      this.isPressing.set(false);
    }, 620);
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
