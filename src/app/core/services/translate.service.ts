import { Injectable, signal } from '@angular/core';

import { EN } from '@i18n/en';

type DeepPartial<T> = { [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P] };
type TranslationNode = typeof EN | DeepPartial<typeof EN> | string | string[] | undefined;

/**
 * Service providing i18n translation lookups using dot-notation keys.
 * Currently supports English only; additional languages can be registered via _translations.
 */
@Injectable({ providedIn: 'root' })
export class TranslateService {
  private readonly _lang = signal<'en'>('en');
  private readonly _translations: Record<string, typeof EN> = { en: EN };

  /**
   * Returns the current language code.
   *
   * @returns The active language code (e.g. 'en')
   */
  get currentLang(): string { return this._lang(); }

  /**
   * Resolves a dot-notation key to its string translation.
   * Returns the key itself if the translation is not found.
   *
   * @param key - Dot-notation key, e.g. 'nav.about'
   * @returns The translated string, or the key if not found
   */
  public t(key: string): string {
    const parts: Array<string> = key.split('.');
    let node: TranslationNode = this._translations[this._lang()] ?? {};
    for (const part of parts) {
      if (typeof node === 'object' && node !== null && !Array.isArray(node)) {
        node = (node as Record<string, TranslationNode>)[part];
      } else {
        return key;
      }
      if (node === undefined) return key;
    }
    return typeof node === 'string' ? node : key;
  }

  /**
   * Resolves a dot-notation key and returns it as a string array.
   * Returns an empty array if the key does not resolve to an array.
   *
   * @param key - Dot-notation key, e.g. 'hero.roles'
   * @returns Array of strings at the given key
   */
  public tArray(key: string): Array<string> {
    const parts: Array<string> = key.split('.');
    let node: TranslationNode = this._translations[this._lang()] ?? {};
    for (const part of parts) {
      if (typeof node === 'object' && node !== null && !Array.isArray(node)) {
        node = (node as Record<string, TranslationNode>)[part];
      } else {
        return [];
      }
    }
    return Array.isArray(node) ? node : [];
  }

  /**
   * Returns the entire translation section object for a given top-level key.
   *
   * @param key - A top-level key of the EN translation object
   * @returns The translation section object
   */
  public section<K extends keyof typeof EN>(key: K): (typeof EN)[K] {
    return (this._translations[this._lang()] as typeof EN)[key];
  }
}
