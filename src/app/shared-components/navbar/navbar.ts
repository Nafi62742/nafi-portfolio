import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ScrollService } from '@services/scroll.service';
import { Theme, ThemeService } from '@services/theme.service';
import { TranslateService } from '@services/translate.service';

/** Sub-section item inside a unified navbar tab. */
export interface NavSubSection {
  id: string;
  code: string;
  key: string;
  subLabel: string;
  icon: string;
}

/** Unified top-level tab grouping 2–3 relevant portfolio sections. */
export interface UnifiedNavGroup {
  id: string;
  code: string;
  label: string;
  defaultSectionId: string;
  children: Array<NavSubSection>;
}

/**
 * Architectural Navbar component with minimized unified tabs, interactive
 * sub-section dropdowns, multi-theme bluish preset switching, R-007 hood
 * splash trigger, and mobile grouped navigation.
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
   * Grouped navigation tabs displayed inside the mobile overlay menu.
   */
  public readonly navGroups: Array<UnifiedNavGroup> = [
    {
      id: 'profile',
      code: '01',
      label: 'Profile',
      defaultSectionId: 'about',
      children: [
        { id: 'hero',   code: '1.1', key: 'nav.home',   subLabel: 'Two Sides // Intro',    icon: 'fa-compass' },
        { id: 'about',  code: '1.2', key: 'nav.about',  subLabel: 'Player 1 // Bio & Lab', icon: 'fa-user-astronaut' },
        { id: 'skills', code: '1.3', key: 'nav.skills', subLabel: 'Loadout // Tech Stack', icon: 'fa-microchip' }
      ]
    },
    {
      id: 'work',
      code: '02',
      label: 'Work & Career',
      defaultSectionId: 'projects',
      children: [
        { id: 'experience', code: '2.1', key: 'nav.experience', subLabel: 'The Factory // Career Belt', icon: 'fa-industry' },
        { id: 'projects',   code: '2.2', key: 'nav.projects',   subLabel: 'The Street // Storefronts',  icon: 'fa-road' }
      ]
    },
    {
      id: 'credentials',
      code: '03',
      label: 'Credentials',
      defaultSectionId: 'publications',
      children: [
        { id: 'publications', code: '3.1', key: 'nav.publications', subLabel: 'IEEE & Springer Research', icon: 'fa-book-journal-whills' },
        { id: 'education',    code: '3.2', key: 'nav.education',    subLabel: 'B.Sc. CSE & Leadership',   icon: 'fa-graduation-cap' }
      ]
    }
  ];

  public readonly scroll = inject(ScrollService);
  public readonly theme = inject(ThemeService);
  public readonly t = inject(TranslateService);
  private readonly router = inject(Router);

  /**
   * Getter to check if the navbar should be in scrolled state (solid background).
   */
  public get isNavbarScrolled(): boolean {
    return this.scroll.isScrolled() || this.router.url !== '/' || this.menuOpen();
  }

  /**
   * Closes open dropdowns when clicking outside the navbar.
   */
  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target?.closest('.site-header')) {
      this.themeMenuOpen.set(false);
    }
  }

  /**
   * Checks if a given sub-section ID is currently active based on scroll tracking.
   * Note: 'runmate' maps to 'projects' since RunMate is part of the Projects showcase flow.
   */
  public isLinkActive(id: string): boolean {
    if (this.router.url !== '/' && this.router.url.length > 0) {
      return false;
    }
    const active = this.scroll.activeSection();
    if (id === 'projects' && active === 'runmate') {
      return true;
    }
    return active === id;
  }

  /**
   * Navigates to a section. If not on the home page, navigates to home first then scrolls.
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
   * Selects a specific theme preset and closes the popover.
   */
  public selectTheme(id: Theme): void {
    this.theme.setTheme(id);
    this.themeMenuOpen.set(false);
  }

  /**
   * Toggles the mobile menu open/closed state.
   */
  public toggleMenu(): void {
    this.menuOpen.update((v: boolean) => !v);
    this.themeMenuOpen.set(false);
  }
}
