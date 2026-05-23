import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateService } from '../../core/services/translate.service';
import { PortfolioService } from '../../core/services/portfolio.service';
import { Publication } from '../../shared/models/portfolio.models';

@Component({
  selector: 'app-publications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './publications.component.html',
  styleUrl: './publications.component.scss'
})
export class PublicationsComponent {
  publications: Publication[];

  constructor(public t: TranslateService, portfolio: PortfolioService) {
    this.publications = portfolio.getPublications();
  }

  toSlug(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
}
