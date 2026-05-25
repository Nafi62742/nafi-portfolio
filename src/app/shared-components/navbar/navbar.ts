
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ScrollService } from '@services/scroll.service';
import { ThemeService } from '@services/theme.service';
import { TranslateService } from '@services/translate.service';

/**
 * Navbar component with responsive mobile menu, active section tracking,
 * and scroll-based navigation.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {
  /** Signal tracking whether the mobile menu is open. */
  public readonly menuOpen = signal<boolean>(false);

  /**
   * Getter to check if the navbar should be in scrolled state (solid background).
   *
   * @returns True if the navbar should be in scrolled state, false otherwise.
   */
  public get isNavbarScrolled(): boolean {
    return this.scroll.isScrolled() || this.router.url !== '/';
  }

  /** Navigation link definitions with i18n key and section ID. */
  public readonly navLinks: Array<{ key: string; id: string }> = [
    { key: 'nav.about',        id: 'about' },
    { key: 'nav.skills',       id: 'skills' },
    { key: 'nav.experience',   id: 'experience' },
    { key: 'nav.projects',     id: 'projects' },
    { key: 'nav.publications', id: 'publications' },
    { key: 'nav.education',    id: 'education' },
    { key: 'nav.contact',      id: 'contact' }
  ];

  /**
   * @param scroll - Scroll service for section navigation
   * @param theme - Theme service for light/dark mode toggling
   * @param t - Translation service for i18n labels
   * @param router - Angular router for page-level navigation
   */
  public readonly scroll = inject(ScrollService);
  public readonly theme = inject(ThemeService);
  public readonly t = inject(TranslateService);
  private readonly router = inject(Router);

  /**
   * Checks if a given nav link is currently active based on the router URL.
   *
   * @param id - The link identifier/route path.
   * @returns True if the link is active, false otherwise.
   */
  public isLinkActive(id: string): boolean {
    const currentUrl: string = this.router.url;
    if (id === 'hero') {
      return currentUrl === '/' || currentUrl.length === 0;
    }
    return currentUrl === '/' + id;
  }

  /**
   * Navigates to a section route.
   *
   * @param id - The route path to navigate to
   */
  public navigate(id: string): void {
    if (id === 'hero') {
      this.router.navigate(['/']);
    } else {
      this.router.navigate([id]);
    }
    this.menuOpen.set(false);
  }

  /**
   * Toggles the mobile menu open/closed state.
   */
  public toggleMenu(): void {
    this.menuOpen.update((v: boolean) => !v);
  }
}
