import { Injectable, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { fromEvent } from 'rxjs';
import { throttleTime, filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ScrollService {
  activeSection = signal<string>('hero');
  isScrolled     = signal<boolean>(false);

  readonly sections = ['hero', 'about', 'skills', 'experience', 'projects', 'publications', 'education', 'contact'];

  private previousUrl: string | null = null;
  private currentUrl: string | null = null;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.previousUrl = this.currentUrl;
      this.currentUrl = event.urlAfterRedirects || event.url;

      // If we navigate back to home from project page (supports browser back/forward and in-app clicks)
      if ((this.currentUrl === '/' || this.currentUrl === '') && this.previousUrl?.startsWith('/project/')) {
        setTimeout(() => {
          this.scrollTo('projects', 'auto');
        }, 100);
      }
    });
  }

  init(): void {
    fromEvent(window, 'scroll')
      .pipe(throttleTime(100))
      .subscribe(() => {
        this.isScrolled.set(window.scrollY > 60);
        this._updateActive();
      });
  }

  scrollTo(id: string, behavior: ScrollBehavior = 'smooth'): void {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior, block: 'start' });
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
