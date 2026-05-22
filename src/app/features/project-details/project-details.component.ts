import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PortfolioService } from '../../core/services/portfolio.service';
import { ScrollService } from '../../core/services/scroll.service';
import { Project } from '../../shared/models/portfolio.models';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent implements OnInit {
  project = signal<Project | null>(null);
  safeYoutubeUrl = signal<SafeResourceUrl | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private portfolioService: PortfolioService,
    private scrollService: ScrollService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // Listen to route params changes
    this.route.paramMap.subscribe(params => {
      const slug = params.get('id');
      if (slug) {
        const foundProject = this.portfolioService.getProjectBySlug(slug);
        if (foundProject) {
          this.project.set(foundProject);
          if (foundProject.youtube) {
            const safeUrl = this.getSafeYoutubeUrl(foundProject.youtube);
            if (safeUrl) {
              this.safeYoutubeUrl.set(safeUrl);
            }
          } else {
            this.safeYoutubeUrl.set(null);
          }
          // Scroll window to top when details page loads
          window.scrollTo({ top: 0, behavior: 'instant' as any });
        } else {
          // If project not found, redirect to home
          this.router.navigate(['/']);
        }
      }
    });
  }

  getSafeYoutubeUrl(url: string): SafeResourceUrl | undefined {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      const videoId = match[2];
      return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
    }
    return undefined;
  }

  goBack(): void {
    this.router.navigate(['/']).then(() => {
      setTimeout(() => {
        this.scrollService.scrollTo('projects', 'auto');
      }, 50);
    });
  }

  hexToRgb(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  }
}
