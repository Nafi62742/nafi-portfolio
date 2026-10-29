import { Injectable, signal } from '@angular/core';

/** Union type representing the supported design theme presets. */
export type Theme = 'slate' | 'amber' | 'cyber' | 'glacier';

/** Metadata for a theme preset shown in the navbar theme switcher. */
export interface ThemePreset {
  id: Theme;
  name: string;
  shortLabel: string;
  swatch: string;
  icon: string;
}

/**
 * Service that manages the application's multi-theme design presets.
 * Persists the user's preference to localStorage.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  /** Available theme presets covering Option 2, Option 4, Option 1, and Option 3. */
  public readonly presets: Array<ThemePreset> = [
    {
      id: 'slate',
      name: 'Option 2: Executive Slate & Cobalt',
      shortLabel: 'SLATE // COBALT',
      swatch: '#2563eb',
      icon: 'fa-briefcase'
    },
    {
      id: 'amber',
      name: 'Option 4: Carbon Titanium & Amber',
      shortLabel: 'TITANIUM // AMBER',
      swatch: '#f59e0b',
      icon: 'fa-fire'
    },
    {
      id: 'cyber',
      name: 'Option 1: Obsidian & Electric Sapphire',
      shortLabel: 'OBSIDIAN // BLUE',
      swatch: '#00f0ff',
      icon: 'fa-bolt'
    },
    {
      id: 'glacier',
      name: 'Option 3: Glacier Daylight Blueprint',
      shortLabel: 'GLACIER // DAYLIGHT',
      swatch: '#0284c7',
      icon: 'fa-sun'
    }
  ];

  private readonly _theme = signal<Theme>('slate');

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
   * Returns true when the current theme is a dark mode theme (slate, amber, or cyber).
   *
   * @returns True if dark theme is active, false for daylight glacier
   */
  public get isDark(): boolean {
    return this._theme() !== 'glacier';
  }

  /**
   * Cycles to the next theme preset and persists the selection.
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
   * Initialises the theme from localStorage or defaults to Option 2 ('slate').
   */
  public init(): void {
    const saved: string | null = localStorage.getItem('portfolio-theme');
    const validIds: Array<Theme> = ['slate', 'amber', 'cyber', 'glacier'];
    const theme: Theme = validIds.includes(saved as Theme) ? (saved as Theme) : 'slate';
    this.setTheme(theme);
  }
}
