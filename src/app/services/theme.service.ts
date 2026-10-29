import { Injectable, signal } from '@angular/core';

/** Union type representing the supported design theme modes. */
export type Theme = 'dark' | 'light';

/** Metadata for theme presets (supporting backward compatibility). */
export interface ThemePreset {
  id: Theme;
  name: string;
  shortLabel: string;
  icon: string;
}

/**
 * Service that manages the application's Light and Dark design modes:
 * - 'dark': Option 2 (Executive Slate & Cobalt) — Zinc/Cobalt Linear/Vercel developer tool aesthetic
 * - 'light': Glacier Daylight Blueprint — Clean ice & oceanic architectural daylight mode
 * Persists the user's preference to localStorage.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  /** Two clean modes: Dark (Executive Slate) and Light (Glacier). */
  public readonly presets: Array<ThemePreset> = [
    {
      id: 'dark',
      name: 'Dark Mode',
      shortLabel: 'DARK',
      icon: 'fa-moon'
    },
    {
      id: 'light',
      name: 'Light Mode',
      shortLabel: 'LIGHT',
      icon: 'fa-sun'
    }
  ];

  private readonly _theme = signal<Theme>('dark');

  /**
   * Returns the current theme value ('dark' | 'light').
   *
   * @returns The active theme mode
   */
  public get theme(): Theme {
    return this._theme();
  }

  /**
   * Returns true when Dark Mode (Executive Slate & Cobalt) is active.
   *
   * @returns True if dark theme is active, false for daylight glacier
   */
  public get isDark(): boolean {
    return this._theme() === 'dark';
  }

  /**
   * Returns human-readable label for the active mode.
   */
  public get modeLabel(): string {
    return this._theme() === 'dark' ? 'Dark Mode' : 'Light Mode';
  }

  /**
   * Toggles between Dark Mode and Light Mode and persists the selection.
   */
  public toggle(): void {
    const next: Theme = this._theme() === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  /**
   * Sets a specific theme mode ('dark' or 'light') and persists it to localStorage.
   *
   * @param theme - The theme mode to activate
   */
  public setTheme(theme: Theme): void {
    this._theme.set(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }

  /**
   * Initialises the theme from localStorage or defaults to Dark Mode ('dark').
   * Backward-compatible with previous theme names ('slate', 'glacier', 'amber', 'cyber').
   */
  public init(): void {
    const saved: string | null = localStorage.getItem('portfolio-theme');
    let theme: Theme = 'dark';
    if (saved === 'light' || saved === 'glacier') {
      theme = 'light';
    } else if (saved === 'dark' || saved === 'slate' || saved === 'amber' || saved === 'cyber') {
      theme = 'dark';
    }
    this.setTheme(theme);
  }
}
