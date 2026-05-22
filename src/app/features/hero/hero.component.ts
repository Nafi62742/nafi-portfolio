import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '../../core/services/translate.service';
import { ScrollService } from '../../core/services/scroll.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  copied = signal(false);

  constructor(
    public t: TranslateService,
    public scroll: ScrollService
  ) {}

  copyEmail(email: string, event: Event): void {
    event.preventDefault();
    navigator.clipboard.writeText(email).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2500);
    });
    window.location.href = 'mailto:' + email;
  }

  scrollToProjects(): void {
    this.scroll.scrollTo('projects');
  }

  scrollToContact(): void {
    this.scroll.scrollTo('contact');
  }
}
