import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '../../core/services/translate.service';
import { PortfolioService } from '../../core/services/portfolio.service';
import { Publication } from '../../shared/models/portfolio.models';

@Component({
  selector: 'app-publications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './publications.component.html',
  styleUrl: './publications.component.scss'
})
export class PublicationsComponent {
  publications: Publication[];

  constructor(public t: TranslateService, portfolio: PortfolioService) {
    this.publications = portfolio.getPublications();
  }
}
