import { Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

import { ScrollService } from '@services/scroll.service';
import { ThemeService } from '@services/theme.service';
import { FooterComponent } from '@shared-components/footer/footer';
import { NavbarComponent } from '@shared-components/navbar/navbar';
import { SplashScreenComponent } from '@shared-components/splash-screen/splash-screen.component';
import { StarfieldComponent } from '@shared-components/starfield/starfield.component';

/**
 * Root component of the portfolio application.
 * Initialises global services like theme, scroll tracking, R-007 splash screen,
 * and the devinthehood-style interactive cursor.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    StarfieldComponent,
    SplashScreenComponent
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

  /** Cursor X coordinate in viewport pixels. */
  public readonly cursorX = signal<number>(-100);

  /** Cursor Y coordinate in viewport pixels. */
  public readonly cursorY = signal<number>(-100);

  /** Whether the pointer is currently inside the viewport. */
  public readonly cursorVisible = signal<boolean>(false);

  /** Whether the cursor is hovering over an interactive target. */
  public readonly cursorHover = signal<boolean>(false);

  /** Optional contextual label inside the cursor ring (from `[data-cursor]`). */
  public readonly cursorLabel = signal<string>('');

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
   * Tracks pointer coordinates and detects `[data-cursor]` or interactive elements.
   */
  @HostListener('window:mousemove', ['$event'])
  public onMouseMove(event: MouseEvent): void {
    this.cursorX.set(event.clientX);
    this.cursorY.set(event.clientY);
    if (!this.cursorVisible()) {
      this.cursorVisible.set(true);
    }

    const target = event.target as HTMLElement | null;
    if (!target) {
      this.cursorHover.set(false);
      this.cursorLabel.set('');
      return;
    }

    // Keep the cursor subtle when inside the top navbar so it never obscures nav menus
    if (target.closest('.site-header')) {
      const navInteractive = target.closest('a, button, [role="button"]');
      this.cursorHover.set(Boolean(navInteractive));
      this.cursorLabel.set('');
      return;
    }

    const cursorEl = target.closest('[data-cursor]') as HTMLElement | null;
    if (cursorEl) {
      this.cursorHover.set(true);
      this.cursorLabel.set(cursorEl.getAttribute('data-cursor') ?? '');
      return;
    }

    const interactiveEl = target.closest('a, button, [role="button"]');
    this.cursorHover.set(Boolean(interactiveEl));
    this.cursorLabel.set('');
  }

  /**
   * Hides the custom cursor when the pointer leaves the browser window.
   */
  @HostListener('document:mouseleave')
  public onMouseLeave(): void {
    this.cursorVisible.set(false);
  }

  /**
   * Updates the isWorkstation state based on the current URL.
   */
  private updateWorkstationState(url: string): void {
    const isWs = url.includes('/workstation') || url.includes('/pc_config');
    this.isWorkstation.set(isWs);
  }
}
