import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';

import { PortfolioService } from '@services/portfolio.service';
import { TranslateService } from '@services/translate.service';
import { SkillCategory } from '@shared/models/portfolio.models';

/**
 * Skills section component displaying categorised technology skills.
 */
@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent {
  /** All skill categories loaded from the portfolio service. */
  public readonly categories: Array<SkillCategory>;

  /** Index of the currently active/selected skill category tab. */
  public activeCategory: number = 0;

  /**
   * @param t - Translation service for i18n labels
   * @param portfolio - Portfolio data service providing skill categories
   */
  constructor(
    @Inject(TranslateService) public readonly t: TranslateService,
    @Inject(PortfolioService) private readonly portfolio: PortfolioService
  ) {
    this.categories = this.portfolio.getSkillCategories();
  }
}
