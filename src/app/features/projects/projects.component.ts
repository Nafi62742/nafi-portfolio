import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '../../core/services/translate.service';
import { PortfolioService } from '../../core/services/portfolio.service';
import { Project } from '../../shared/models/portfolio.models';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  projects: Project[];

  constructor(public t: TranslateService, portfolio: PortfolioService) {
    this.projects = portfolio.getProjects();
  }

  hexToRgb(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  }
}
