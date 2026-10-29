import { Component, computed, inject, signal } from '@angular/core';

import { InteractiveSceneService } from '@services/interactive-scene.service';
import { ScrollService } from '@services/scroll.service';
import { TranslateService } from '@services/translate.service';

/**
 * Hero section component styled as the interactive "Two Sides: Front vs Back"
 * split stage inspired by devinthehood.com while preserving all portfolio data.
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
   * Interactive split percentage (30 to 70, default 50).
   * Controls both the CSS grid column ratio and the SVG character clip-path seam.
   */
  public readonly splitRatio = signal<number>(50);

  /** Computed SVG X coordinate (0..500) for the character split seam. */
  public readonly svgSplitX = computed<number>(() => Math.round((this.splitRatio() / 100) * 500));

  /** Profile link for GitHub. */
  public readonly githubUrl: string = 'https://github.com/Nafi62742';

  /** Profile link for LinkedIn. */
  public readonly linkedinUrl: string = 'https://linkedin.com/in/racer007';

  /** Primary contact email address. */
  public readonly emailAddress: string = 'nafiahmed318@gmail.com';

  public readonly t: TranslateService = inject(TranslateService);
  public readonly scroll: ScrollService = inject(ScrollService);
  public readonly sceneService: InteractiveSceneService = inject(InteractiveSceneService);

  /**
   * Sets the interactive split ratio between Front and Back sides.
   *
   * @param ratio - Percentage for the Front side (e.g. 64, 50, or 36)
   */
  public setSplit(ratio: number): void {
    this.splitRatio.set(Math.max(30, Math.min(70, ratio)));
  }

  /**
   * Handles range input scrubbing on the Front/Back divider control.
   */
  public onSplitInput(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (input) {
      this.setSplit(Number(input.value));
    }
  }

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
