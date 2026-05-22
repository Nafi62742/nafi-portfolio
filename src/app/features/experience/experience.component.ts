import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '../../core/services/translate.service';
import { PortfolioService } from '../../core/services/portfolio.service';
import { Experience } from '../../shared/models/portfolio.models';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent {
  experiences: Experience[];

  constructor(public t: TranslateService, portfolio: PortfolioService) {
    this.experiences = portfolio.getExperiences();
  }
}
