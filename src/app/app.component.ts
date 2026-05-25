
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ScrollService } from '@services/scroll.service';
import { ThemeService } from '@services/theme.service';
import { FooterComponent } from '@shared-components/footer/footer';
import { NavbarComponent } from '@shared-components/navbar/navbar';

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
    FooterComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private readonly themeService = inject(ThemeService);
  private readonly scrollService = inject(ScrollService);

  /**
   * Initialises theme and scroll services on component init.
   */
  public ngOnInit(): void {
    this.themeService.init();
    this.scrollService.init();
  }
}
