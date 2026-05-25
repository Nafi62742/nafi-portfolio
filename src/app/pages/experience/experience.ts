import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { Experience } from '@models/portfolio.models';
import { PortfolioService } from '@services/portfolio.service';
import { TranslateService } from '@services/translate.service';

/**
 * Experience section component displaying professional work history.
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
   * @param t - Translation service for i18n labels
   * @param portfolio - Portfolio data service providing experience entries
   */
  private readonly portfolio = inject(PortfolioService);
  public readonly t = inject(TranslateService);

  constructor() {
    this.experiences = this.portfolio.getExperiences();
  }
}
