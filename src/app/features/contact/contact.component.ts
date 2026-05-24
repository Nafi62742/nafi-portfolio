import { CommonModule } from '@angular/common';
import { Component, Inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
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

  /** Contact detail rows displayed alongside the form. */
  public readonly contactInfo: Array<ContactInfoItem> = [
    { icon: 'fa-envelope',     label: 'Email',    value: 'nafiahmed318@gmail.com', href: 'mailto:nafiahmed318@gmail.com' },
    { icon: 'fa-phone',        label: 'Phone',    value: '+8801760887297',          href: 'tel:+8801760887297'            },
    { icon: 'fa-location-dot', label: 'Location', value: 'Dhaka, Bangladesh',       href: null                            }
  ];

  /** Social links shown below the contact details. */
  public readonly socials: Array<SocialItem> = [
    { icon: 'fa-brands fa-github',   label: 'GitHub',   href: 'https://github.com/Nafi62742'     },
    { icon: 'fa-brands fa-linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/racer007' },
    { icon: 'fa-solid fa-envelope',  label: 'Email',    href: 'mailto:nafiahmed318@gmail.com'     }
  ];

  /**
   * @param t - Translation service for i18n labels
   */
  constructor(@Inject(TranslateService) public readonly t: TranslateService) {}

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
    window.location.href = 'mailto:' + email;
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
