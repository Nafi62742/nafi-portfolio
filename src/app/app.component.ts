
import { Component, OnInit, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

import { ScrollService } from '@services/scroll.service';
import { ThemeService } from '@services/theme.service';
import { FooterComponent } from '@shared-components/footer/footer';
import { NavbarComponent } from '@shared-components/navbar/navbar';
import { StarfieldComponent } from '@shared-components/starfield/starfield.component';

/**
 * Root component of the portfolio application.
 * Initialises global services like theme and scroll tracking.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    StarfieldComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly themeService = inject(ThemeService);
  private readonly scrollService = inject(ScrollService);

  /**
   * Indicates whether the current active route belongs to the isolated workstation module.
   * When true, portfolio navbar and footer are hidden in favor of workstation's dedicated layout.
   */
  public readonly isWorkstation = signal<boolean>(false);

  constructor() {
    this.updateWorkstationState(this.router.url);
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.updateWorkstationState(event.urlAfterRedirects || event.url);
      });
  }

  /**
   * Initialises theme and scroll services on component init.
   */
  public ngOnInit(): void {
    this.themeService.init();
    this.scrollService.init();
  }

  /**
   * Updates the isWorkstation state based on the current URL.
   */
  private updateWorkstationState(url: string): void {
    const isWs = url.includes('/workstation') || url.includes('/pc_config');
    this.isWorkstation.set(isWs);
  }
}

