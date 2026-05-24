import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';

import { PortfolioService } from '@services/portfolio.service';
import { TranslateService } from '@services/translate.service';
import { Experience } from '@shared/models/portfolio.models';

/**
 * Experience section component displaying professional work history.
 */
@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent {
  /** All experience entries loaded from the portfolio service. */
  public readonly experiences: Array<Experience>;

  /**
   * @param t - Translation service for i18n labels
   * @param portfolio - Portfolio data service providing experience entries
   */
  constructor(
    @Inject(TranslateService) public readonly t: TranslateService,
    @Inject(PortfolioService) private readonly portfolio: PortfolioService
  ) {
    this.experiences = this.portfolio.getExperiences();
  }
}
