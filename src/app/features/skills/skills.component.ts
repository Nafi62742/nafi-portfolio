import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '../../core/services/translate.service';
import { PortfolioService } from '../../core/services/portfolio.service';
import { SkillCategory } from '../../shared/models/portfolio.models';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent {
  categories: SkillCategory[];
  activeCategory = 0;

  constructor(
    public t: TranslateService,
    private portfolio: PortfolioService
  ) {
    this.categories = this.portfolio.getSkillCategories();
  }
}
