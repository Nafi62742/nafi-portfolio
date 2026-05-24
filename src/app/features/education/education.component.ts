import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';

import { PortfolioService } from '@services/portfolio.service';
import { TranslateService } from '@services/translate.service';
import { Education, Leadership } from '@shared/models/portfolio.models';

/**
 * Education section component displaying academic background and leadership roles.
 */
@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss'
})
export class EducationComponent {
  /** All education entries loaded from the portfolio service. */
  public readonly educations: Array<Education>;

  /** All leadership entries loaded from the portfolio service. */
  public readonly leadership: Array<Leadership>;

  /**
   * @param t - Translation service for i18n labels
   * @param portfolio - Portfolio data service providing education and leadership entries
   */
  constructor(
    @Inject(TranslateService) public readonly t: TranslateService,
    @Inject(PortfolioService) private readonly portfolio: PortfolioService
  ) {
    this.educations = this.portfolio.getEducation();
    this.leadership = this.portfolio.getLeadership();
  }
}
