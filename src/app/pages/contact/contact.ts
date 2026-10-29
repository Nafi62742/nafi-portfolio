import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ContactSignalScene, InteractiveSceneService } from '@services/interactive-scene.service';
import { TranslateService } from '@services/translate.service';

/** Shape of a single contact info row (email, phone, location). */
interface ContactInfoItem {
  icon:  string;
  label: string;
  value: string;
  href:  string | null;
}

/** Shape of a single social link icon. */
interface SocialItem {
  icon:  string;
  label: string;
  href:  string;
}

/** Response shape from the Web3Forms API. */
interface Web3FormsResponse {
  success: boolean;
}

/**
 * Contact section component with a working form submission and copy-to-clipboard email.
 */
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class ContactComponent {
  /** Bound to the name input field. */
  public name: string | null = null;

  /** Bound to the email input field. */
  public email: string | null = null;

  /** Bound to the message textarea. */
  public message: string | null = null;

  /** True while the form submission request is in flight. */
  public readonly sending = signal<boolean>(false);

  /** True for 5 seconds after a successful form submission. */
  public readonly success = signal<boolean>(false);

  /** True for 2.5 seconds after the email is copied to clipboard. */
  public readonly copied = signal<boolean>(false);

  /** Whether the finale rooftop R-007 searchlight signal beam is lit. */
  public readonly signalLit = signal<boolean>(true);

  /** Currently inspected relay node index in the JSON-driven uplink animation. */
  public readonly activeNodeIdx = signal<number>(0);

  /** True briefly when a test ping packet is fired across the JSON relay circuit. */
  public readonly pingingUplink = signal<boolean>(false);

  /** Contact detail rows displayed alongside the form. */
  public readonly contactInfo: Array<ContactInfoItem> = [
    { icon: 'fa-envelope',     label: 'Email',    value: 'nafiahmed318@gmail.com', href: 'https://mail.google.com/mail/?view=cm&fs=1&to=nafiahmed318@gmail.com' },
    { icon: 'fa-phone',        label: 'Phone',    value: '+8801760887297',          href: 'tel:+8801760887297'            },
    { icon: 'fa-location-dot', label: 'Location', value: 'Dhaka, Bangladesh',       href: null                            }
  ];

  /** Social links shown below the contact details. */
  public readonly socials: Array<SocialItem> = [
    { icon: 'fa-brands fa-github',   label: 'GitHub',   href: 'https://github.com/Nafi62742'     },
    { icon: 'fa-brands fa-linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/nafi-ahmed/' },
    { icon: 'fa-solid fa-envelope',  label: 'Email',    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=nafiahmed318@gmail.com'     }
  ];

  public readonly t = inject(TranslateService);
  public readonly sceneService = inject(InteractiveSceneService);

  /** JSON-driven Contact Signal & Relay animation scene from assets/data/interactive-scenes.json. */
  public readonly contactScene = computed<ContactSignalScene>(
    () => this.sceneService.config().scenes.contactSignal
  );

  /**
   * Toggles the rooftop R-007 searchlight beam in the finale skyline.
   */
  public toggleSignal(): void {
    this.signalLit.update((v: boolean) => !v);
  }

  /**
   * Selects a relay node in the JSON-driven packet visualizer and triggers a test ping.
   */
  public selectRelayNode(index: number): void {
    this.activeNodeIdx.set(index);
    this.triggerUplinkPing();
  }

  /**
   * Fires an animated test packet burst across the JSON-defined relay nodes.
   */
  public triggerUplinkPing(): void {
    this.pingingUplink.set(true);
    setTimeout(() => {
      this.pingingUplink.set(false);
    }, 1100);
  }

  /**
   * Syncs `aria-invalid` with the native CSS `:user-invalid` pseudo-class on blur/input.
   */
  public syncFieldAria(event: Event): void {
    const el = event.target as HTMLElement | null;
    if (!el || typeof el.matches !== 'function') {
      return;
    }
    try {
      el.setAttribute('aria-invalid', el.matches(':user-invalid') ? 'true' : 'false');
    } catch {
      // Ignore if selector is unsupported in older environments
    }
  }

  /**
   * Computes live JSON payload size in bytes as the user fills in the contact form.
   */
  public get payloadBytes(): number {
    const base = 112;
    const n: number = (this.name ?? '').length;
    const e: number = (this.email ?? '').length;
    const m: number = (this.message ?? '').length;
    return base + n + e + m;
  }

  /**
   * Computes form completion stage (1..4) to light up the JSON relay nodes progressively.
   */
  public get activeRelayStage(): number {
    if (this.success()) {
      return 4;
    }
    if (this.sending() || this.pingingUplink()) {
      return 4;
    }
    let stage = 1;
    if (this.name && this.name.trim().length > 0) {
      stage = 2;
    }
    if (this.email && this.email.trim().length > 0) {
      stage = 3;
    }
    if (this.message && this.message.trim().length > 0) {
      stage = 4;
    }
    return stage;
  }

  /**
   * Evaluates live terminal Easter-egg responses (devinthehood style) based on message input.
   */
  public get terminalEasterEgg(): { type: 'ok' | 'err'; text: string } | null {
    const raw: string = `${this.name ?? ''} ${this.message ?? ''}`.trim();
    if (!raw) {
      return null;
    }
    if (/\bsudo make me a sandwich\b/i.test(raw)) {
      return { type: 'ok', text: '> Okay. 🥪' };
    }
    if (/\bmake me a sandwich\b/i.test(raw)) {
      return { type: 'err', text: '! What? Make it yourself.' };
    }
    if (/\brm -rf \/(?!\S)/.test(raw)) {
      return { type: 'err', text: '! rm: refusing to remove the whole hood. Nice try.' };
    }
    if (/\bgit blame\b/i.test(raw)) {
      return { type: 'ok', text: '> It was the intern. There is no intern.' };
    }
    if (/\b(?:hire|hired)\b.*\b(?:nafi|racer|racer007)\b|\b(?:nafi|racer|racer007)\b.*\bhire/i.test(raw)) {
      return { type: 'ok', text: '> Wise choice. Press Send.' };
    }
    return null;
  }

  /**
   * Copies the provided email address to the clipboard and opens the default mail client.
   *
   * @param email - The email address to copy
   * @param event - The originating DOM event (prevents default anchor behaviour)
   */
  public copyEmail(email: string, event: Event): void {
    event.preventDefault();
    navigator.clipboard.writeText(email).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2500);
    }).catch((err: Error) => {
      console.error('Failed to copy text: ', err);
    });
    window.open('https://mail.google.com/mail/?view=cm&fs=1&to=' + email, '_blank');
  }

  /**
   * Submits the contact form to the Web3Forms API.
   * Validates that all fields are filled before sending.
   */
  public onSubmit(): void {
    if (!this.name || !this.email || !this.message) {
      return;
    }

    this.sending.set(true);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: '88142f92-afd8-4eda-8575-a73ed77910be',
        name: this.name,
        email: this.email,
        message: this.message,
        subject: 'New Message from Portfolio Contact Form'
      })
    })
    .then((response: Response) => response.json())
    .then((data: Web3FormsResponse) => {
      this.sending.set(false);
      if (data.success) {
        this.success.set(true);
        this.name = null;
        this.email = null;
        this.message = null;
        setTimeout(() => this.success.set(false), 5000);
      } else {
        console.error('Form submission failed. Please check your Web3Forms access key.');
      }
    })
    .catch((error: Error) => {
      this.sending.set(false);
      console.error('Contact form error:', error);
    });
  }
}
