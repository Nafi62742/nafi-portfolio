import { Injectable, signal } from '@angular/core';

/** Union type representing the supported bluish themes. */
export type Theme = 'glacier' | 'cyber';

/** Metadata for a theme preset shown in the navbar theme switcher. */
export interface ThemePreset {
  id: Theme;
  name: string;
  shortLabel: string;
  swatch: string;
  icon: string;
}

/**
 * Service that manages the application's multi-theme bluish design presets.
 * Persists the user's preference to localStorage.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  /** Available bluish theme presets. */
  public readonly presets: Array<ThemePreset> = [
    {
      id: 'glacier',
      name: 'Glacier Daylight Blueprint',
      shortLabel: 'GLACIER',
      swatch: '#0284c7',
      icon: 'fa-sun'
    },
    {
      id: 'cyber',
      name: 'Cyan Overdrive R-007',
      shortLabel: 'CYBER',
      swatch: '#00f0ff',
      icon: 'fa-bolt'
    }
  ];

  private readonly _theme = signal<Theme>('glacier');

  /**
   * Returns the current theme value.
   *
   * @returns The current active theme
   */
  public get theme(): Theme {
    return this._theme();
  }

  /**
   * Returns the active ThemePreset object.
   */
  public get currentPreset(): ThemePreset {
    return this.presets.find((p: ThemePreset) => p.id === this._theme()) ?? this.presets[0];
  }

  /**
   * Returns true when the current theme is Cyan Overdrive ('cyber').
   *
   * @returns True if the active theme is 'cyber', false otherwise
   */
  public get isDark(): boolean {
    return this._theme() === 'cyber';
  }

  /**
   * Cycles to the next bluish theme preset and persists the selection.
   */
  public toggle(): void {
    const idx: number = this.presets.findIndex((p: ThemePreset) => p.id === this._theme());
    const nextPreset: ThemePreset = this.presets[(idx + 1) % this.presets.length];
    this.setTheme(nextPreset.id);
  }

  /**
   * Sets a specific theme preset by ID and persists it to localStorage.
   *
   * @param theme - The theme ID to activate
   */
  public setTheme(theme: Theme): void {
    this._theme.set(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }

  /**
   * Initialises the theme from localStorage or defaults to Glacier Daylight ('glacier').
   */
  public init(): void {
    const saved: string | null = localStorage.getItem('portfolio-theme');
    const validIds: Array<Theme> = ['glacier', 'cyber'];
    const theme: Theme = validIds.includes(saved as Theme) ? (saved as Theme) : 'glacier';
    this.setTheme(theme);
  }
}
