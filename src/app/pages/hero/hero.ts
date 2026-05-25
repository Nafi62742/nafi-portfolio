
import { Component, inject, signal } from '@angular/core';

import { ScrollService } from '@services/scroll.service';
import { TranslateService } from '@services/translate.service';

/**
 * Hero section component displaying name, animated roles, tagline and CTAs.
 */
@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class HeroComponent {
  /** Signal tracking whether the email address was recently copied to clipboard. */
  public readonly copied = signal<boolean>(false);

  /**
   * @param t - Translation service for i18n labels
   * @param scroll - Scroll service for CTA button navigation
   */
  public readonly t = inject(TranslateService);
  public readonly scroll = inject(ScrollService);

  /**
   * Copies the given email to the clipboard and opens the mail client.
   *
   * @param email - The email address to copy and open
   * @param event - The originating DOM event (used to prevent default link behaviour)
   */
  public copyEmail(email: string, event: Event): void {
    event.preventDefault();
    navigator.clipboard.writeText(email).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2500);
    });
    window.location.href = 'mailto:' + email;
  }

  /**
   * Scrolls the page to the projects section.
   */
  public scrollToProjects(): void {
    this.scroll.scrollTo('projects');
  }

  /**
   * Scrolls the page to the contact section.
   */
  public scrollToContact(): void {
    this.scroll.scrollTo('contact');
  }
}
