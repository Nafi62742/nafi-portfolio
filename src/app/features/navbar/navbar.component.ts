import { CommonModule } from '@angular/common';
import { Component, Inject, signal } from '@angular/core';
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
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  /** Signal tracking whether the mobile menu is open. */
  public readonly menuOpen = signal<boolean>(false);

  /** Getter to check if the navbar should be in scrolled state (solid background). */
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
  constructor(
    @Inject(ScrollService) public readonly scroll: ScrollService,
    @Inject(ThemeService) public readonly theme: ThemeService,
    @Inject(TranslateService) public readonly t: TranslateService,
    private readonly router: Router
  ) {}

  /**
   * Navigates to a section. If not on the home page, first navigates home then scrolls.
   *
   * @param id - The section element ID to scroll to
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
  }

  /**
   * Toggles the mobile menu open/closed state.
   */
  public toggleMenu(): void {
    this.menuOpen.update((v: boolean) => !v);
  }
}
