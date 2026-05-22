import { Injectable, signal } from '@angular/core';
import { EN } from '../../i18n/en';

type DeepPartial<T> = { [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P] };

@Injectable({ providedIn: 'root' })
export class TranslateService {
  private _lang = signal<'en'>('en');
  private _translations: Record<string, typeof EN> = { en: EN };

  get currentLang() { return this._lang(); }

  /** Resolve a dot-notation key e.g. 'nav.about' */
  t(key: string): string {
    const parts = key.split('.');
    let node: any = this._translations[this._lang()] ?? {};
    for (const part of parts) {
      node = node?.[part];
      if (node === undefined) return key;
    }
    return typeof node === 'string' ? node : key;
  }

  /** Resolve a key and return an array (for items like roles) */
  tArray(key: string): string[] {
    const parts = key.split('.');
    let node: any = this._translations[this._lang()] ?? {};
    for (const part of parts) {
      node = node?.[part];
    }
    return Array.isArray(node) ? node : [];
  }

  /** Access entire section object directly */
  section<K extends keyof typeof EN>(key: K): (typeof EN)[K] {
    return (this._translations[this._lang()] as typeof EN)[key];
  }
}
