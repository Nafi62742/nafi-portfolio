import { Injectable, signal } from '@angular/core';

/** Union type representing the supported themes. */
export type Theme = 'dark' | 'light';

/**
 * Service that manages the application's light/dark theme.
 * Persists the user's preference to localStorage.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _theme = signal<Theme>('dark');

  /**
   * Returns the current theme value.
   *
   * @returns The current active theme ('light' or 'dark')
   */
  get theme(): Theme { return this._theme(); }

  /**
   * Returns true when the current theme is dark.
   *
   * @returns True if the active theme is 'dark', false otherwise
   */
  get isDark(): boolean { return this._theme() === 'dark'; }

  /**
   * Toggles between light and dark themes and persists the selection.
   */
  public toggle(): void {
    const next: Theme = this._theme() === 'dark' ? 'light' : 'dark';
    this._theme.set(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
  }

  /**
   * Initialises the theme from localStorage or the OS preference.
   */
  public init(): void {
    const saved: Theme | null = localStorage.getItem('portfolio-theme') as Theme | null;
    const preferred: Theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme: Theme = saved ?? preferred;
    this._theme.set(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }
}
