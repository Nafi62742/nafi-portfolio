import { Component, computed, inject, signal } from '@angular/core';

import { ScrollService } from '@services/scroll.service';
import { TranslateService } from '@services/translate.service';

/**
 * Hero section component styled as the interactive "Two Sides: Front vs Back"
 * split stage inspired by devinthehood.com with a living, cursor-tracking
 * geometric hooded figure while preserving all portfolio data.
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

  /** Normalized pointer X (-1 to +1) for 3D hood & eye tracking. */
  public readonly pointerX = signal<number>(0);

  /** Normalized pointer Y (-1 to +1) for 3D hood & eye tracking. */
  public readonly pointerY = signal<number>(0);

  /** Whether the hooded figure is in an interactive overdrive scan state. */
  public readonly hoodieEnergized = signal<boolean>(false);

  /** Computed SVG X coordinate (0..500) for the character split seam. */
  public readonly svgSplitX = computed<number>(() => Math.round((this.splitRatio() / 100) * 500));

  /** Computed SVG transform for the glowing visor eyes tracking the cursor. */
  public readonly eyeTransform = computed<string>(() => {
    const dx: number = Math.round(this.pointerX() * 10 * 10) / 10;
    const dy: number = Math.round(this.pointerY() * 6 * 10) / 10;
    return `translate(${dx}px, ${dy}px)`;
  });

  /** Computed SVG transform for the hood cowl tilting toward the cursor. */
  public readonly headTransform = computed<string>(() => {
    const dx: number = Math.round(this.pointerX() * 5.5 * 10) / 10;
    const dy: number = Math.round(this.pointerY() * 3.5 * 10) / 10;
    const rot: number = Math.round(this.pointerX() * 2.2 * 10) / 10;
    return `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
  });

  /** Computed SVG transform for subtle torso counter-parallax. */
  public readonly torsoTransform = computed<string>(() => {
    const dx: number = Math.round(this.pointerX() * 2.5 * 10) / 10;
    const dy: number = Math.round(this.pointerY() * 1.5 * 10) / 10;
    return `translate(${dx}px, ${dy}px)`;
  });

  /** Profile link for GitHub. */
  public readonly githubUrl: string = 'https://github.com/Nafi62742';

  /** Profile link for LinkedIn. */
  public readonly linkedinUrl: string = 'https://www.linkedin.com/in/nafi-ahmed/';

  /** Primary contact email address. */
  public readonly emailAddress: string = 'nafiahmed318@gmail.com';

  public readonly t: TranslateService = inject(TranslateService);
  public readonly scroll: ScrollService = inject(ScrollService);

  /**
   * Tracks pointer movement across the hero split stage so the hooded
   * figure's head, hood cowl, and glowing eyes follow the cursor.
   */
  public onHeroPointerMove(event: PointerEvent): void {
    const el = event.currentTarget as HTMLElement | null;
    if (!el) {
      return;
    }
    const rect: DOMRect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
      return;
    }
    const nx: number = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ny: number = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    this.pointerX.set(Math.max(-1, Math.min(1, nx)));
    this.pointerY.set(Math.max(-1, Math.min(1, ny)));
  }

  /**
   * Smoothly resets gaze tracking when the pointer leaves the hero stage.
   */
  public onHeroPointerLeave(): void {
    this.pointerX.set(0);
    this.pointerY.set(0);
  }

  /**
   * Triggers a scan burst on the hooded character and cycles the Front/Back split inspection.
   */
  public pulseHoodie(): void {
    this.hoodieEnergized.set(true);
    const current: number = this.splitRatio();
    if (Math.abs(current - 50) <= 3) {
      this.setSplit(64);
    } else if (current > 53) {
      this.setSplit(36);
    } else {
      this.setSplit(50);
    }
    setTimeout(() => {
      this.hoodieEnergized.set(false);
    }, 1100);
  }

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
