import { Component, inject, signal } from '@angular/core';

import { ScrollService } from '@services/scroll.service';
import { TranslateService } from '@services/translate.service';

/**
 * Hero section component styled as the "Two Sides: Front vs Back" split stage
 * inspired by devinthehood.com while preserving all portfolio data and actions.
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

  /** Profile link for GitHub. */
  public readonly githubUrl: string = 'https://github.com/Nafi62742';

  /** Profile link for LinkedIn. */
  public readonly linkedinUrl: string = 'https://linkedin.com/in/racer007';

  /** Primary contact email address. */
  public readonly emailAddress: string = 'nafiahmed318@gmail.com';

  /**
   * @param t - Translation service for i18n labels
   * @param scroll - Scroll service for CTA button navigation
   */
  public readonly t: TranslateService = inject(TranslateService);
  public readonly scroll: ScrollService = inject(ScrollService);

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
    window.open('https://mail.google.com/mail/?view=cm&fs=1&to=' + email, '_blank');
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
