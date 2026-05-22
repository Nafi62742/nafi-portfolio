import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ScrollService } from '../../core/services/scroll.service';
import { ThemeService } from '../../core/services/theme.service';
import { TranslateService } from '../../core/services/translate.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  menuOpen = signal(false);

  navLinks = [
    { key: 'nav.about',        id: 'about' },
    { key: 'nav.skills',       id: 'skills' },
    { key: 'nav.experience',   id: 'experience' },
    { key: 'nav.projects',     id: 'projects' },
    { key: 'nav.publications', id: 'publications' },
    { key: 'nav.education',    id: 'education' },
    { key: 'nav.contact',      id: 'contact' }
  ];

  constructor(
    public scroll: ScrollService,
    public theme: ThemeService,
    public t: TranslateService,
    private router: Router
  ) {}

  navigate(id: string): void {
    if (this.router.url !== '/' && this.router.url !== '') {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          this.scroll.scrollTo(id);
        }, 150);
      });
    } else {
      this.scroll.scrollTo(id);
    }
    this.menuOpen.set(false);
  }

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }
}
