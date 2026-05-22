import { Injectable, signal } from '@angular/core';
import { fromEvent } from 'rxjs';
import { throttleTime, distinctUntilChanged, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ScrollService {
  activeSection = signal<string>('hero');
  isScrolled     = signal<boolean>(false);

  readonly sections = ['hero', 'about', 'skills', 'experience', 'projects', 'publications', 'education', 'contact'];

  init(): void {
    fromEvent(window, 'scroll')
      .pipe(throttleTime(100))
      .subscribe(() => {
        this.isScrolled.set(window.scrollY > 60);
        this._updateActive();
      });
  }

  scrollTo(id: string): void {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private _updateActive(): void {
    const scrollY = window.scrollY + 120;
    for (let i = this.sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(this.sections[i]);
      if (el && el.offsetTop <= scrollY) {
        this.activeSection.set(this.sections[i]);
        return;
      }
    }
  }
}
