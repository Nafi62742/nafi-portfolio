import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { InteractiveSceneService } from '@services/interactive-scene.service';
import { ScrollService } from '@services/scroll.service';
import { Theme, ThemeService } from '@services/theme.service';
import { TranslateService } from '@services/translate.service';

/**
 * Simplified, clean architectural Navbar component with multi-theme bluish preset
 * switching, R-007 hood splash trigger, active section tracking, and mobile menu.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {
  /** Signal tracking whether the mobile menu is open. */
  public readonly menuOpen = signal<boolean>(false);

  /** Signal tracking whether the theme preset picker popover is open. */
  public readonly themeMenuOpen = signal<boolean>(false);

  /**
   * Getter to check if the navbar should be in scrolled state (solid background).
   *
   * @returns True if the navbar should be in scrolled state, false otherwise.
   */
  public get isNavbarScrolled(): boolean {
    return this.scroll.isScrolled() || this.router.url !== '/' || this.menuOpen();
  }

  /** Navigation link definitions with i18n key and section ID. */
  public readonly navLinks: Array<{ key: string; id: string }> = [
    { key: 'nav.about',        id: 'about' },
    { key: 'nav.skills',       id: 'skills' },
    { key: 'nav.experience',   id: 'experience' },
    { key: 'nav.projects',     id: 'projects' },
    { key: 'nav.runmate',      id: 'runmate' },
    { key: 'nav.publications', id: 'publications' },
    { key: 'nav.education',    id: 'education' },
    { key: 'nav.contact',      id: 'contact' }
  ];

  public readonly scroll = inject(ScrollService);
  public readonly theme = inject(ThemeService);
  public readonly sceneService = inject(InteractiveSceneService);
  public readonly t = inject(TranslateService);
  private readonly router = inject(Router);

  /**
   * Checks if a given nav link is currently active based on scroll tracking.
   *
   * @param id - The section identifier.
   * @returns True if the section is currently active, false otherwise.
   */
  public isLinkActive(id: string): boolean {
    if (this.router.url !== '/' && this.router.url.length > 0) {
      return false;
    }
    if (id === 'hero') {
      return this.scroll.activeSection() === 'hero';
    }
    return this.scroll.activeSection() === id;
  }

  /**
   * Navigates to a section. If not on the home page, navigates to home first then scrolls.
   *
   * @param id - The element ID of the section to scroll to.
   */
  public navigate(id: string): void {
    if (this.router.url !== '/' && this.router.url.length > 0) {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          this.scroll.scrollTo(id);
        }, 150);
      });
    } else {
      this.scroll.scrollTo(id);
    }
    this.menuOpen.set(false);
    this.themeMenuOpen.set(false);
  }

  /**
   * Toggles the theme preset dropdown menu.
   */
  public toggleThemeMenu(): void {
    this.themeMenuOpen.update((v: boolean) => !v);
  }

  /**
   * Selects a specific bluish theme preset and closes the popover.
   */
  public selectTheme(id: Theme): void {
    this.theme.setTheme(id);
    this.themeMenuOpen.set(false);
  }

  /**
   * Re-opens the R 007 car hood opening splash screen.
   */
  public replayHoodSplash(): void {
    this.menuOpen.set(false);
    this.themeMenuOpen.set(false);
    this.sceneService.triggerSplashReplay();
  }

  /**
   * Toggles the mobile menu open/closed state.
   */
  public toggleMenu(): void {
    this.menuOpen.update((v: boolean) => !v);
    this.themeMenuOpen.set(false);
  }
}
