import { Injectable, signal } from '@angular/core';

export type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _theme = signal<Theme>('dark');

  get theme() { return this._theme(); }
  get isDark() { return this._theme() === 'dark'; }

  toggle(): void {
    const next: Theme = this._theme() === 'dark' ? 'light' : 'dark';
    this._theme.set(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
  }

  init(): void {
    const saved = localStorage.getItem('portfolio-theme') as Theme | null;
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme: Theme = saved ?? preferred;
    this._theme.set(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }
}
