import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '../../core/services/translate.service';
import { PortfolioService } from '../../core/services/portfolio.service';
import { Education, Leadership } from '../../shared/models/portfolio.models';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss'
})
export class EducationComponent {
  educations: Education[];
  leadership: Leadership[];

  constructor(public t: TranslateService, portfolio: PortfolioService) {
    this.educations = portfolio.getEducation();
    this.leadership = portfolio.getLeadership();
  }
}
