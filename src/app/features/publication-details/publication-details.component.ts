import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PortfolioService } from '../../core/services/portfolio.service';
import { ScrollService } from '../../core/services/scroll.service';
import { Publication } from '../../shared/models/portfolio.models';

@Component({
  selector: 'app-publication-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './publication-details.component.html',
  styleUrl: './publication-details.component.scss'
})
export class PublicationDetailsComponent implements OnInit {
  publication = signal<Publication | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private portfolioService: PortfolioService,
    private scrollService: ScrollService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('id');
      if (slug) {
        const found = this.portfolioService.getPublicationBySlug(slug);
        if (found) {
          this.publication.set(found);
          window.scrollTo({ top: 0, behavior: 'instant' as any });
        } else {
          this.router.navigate(['/']);
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']).then(() => {
      setTimeout(() => {
        requestAnimationFrame(() => {
          this.scrollService.scrollTo('publications', 'auto');
        });
      }, 300);
    });
  }

  hexToRgb(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  }
}
