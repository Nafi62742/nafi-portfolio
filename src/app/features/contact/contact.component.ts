import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '../../core/services/translate.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  name    = '';
  email   = '';
  message = '';
  sending = signal(false);
  success = signal(false);
  copied  = signal(false);

  contactInfo = [
    { icon: 'fa-envelope',      label: 'Email',    value: 'nafiahmed318@gmail.com', href: 'mailto:nafiahmed318@gmail.com' },
    { icon: 'fa-phone',         label: 'Phone',    value: '+8801760887297',          href: 'tel:+8801760887297'            },
    { icon: 'fa-location-dot',  label: 'Location', value: 'Dhaka, Bangladesh',       href: null                            }
  ];

  socials = [
    { icon: 'fa-brands fa-github',   label: 'GitHub',   href: 'https://github.com/Nafi62742'         },
    { icon: 'fa-brands fa-linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/racer007'     },
    { icon: 'fa-solid fa-envelope',  label: 'Email',    href: 'mailto:nafiahmed318@gmail.com'         }
  ];

  constructor(public t: TranslateService) {}

  copyEmail(email: string, event: Event): void {
    event.preventDefault();
    navigator.clipboard.writeText(email).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2500);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });

    // Also try opening the mail program normally (without target="_blank")
    window.location.href = 'mailto:' + email;
  }

  onSubmit(): void {
    if (!this.name || !this.email || !this.message) return;

    this.sending.set(true);

    // Using Web3Forms (100% Free Form Endpoint)
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: "88142f92-afd8-4eda-8575-a73ed77910be",
        name: this.name,
        email: this.email,
        message: this.message,
        subject: "New Message from Portfolio Contact Form"
      })
    })
    .then(response => response.json())
    .then(data => {
      this.sending.set(false);
      if (data.success) {
        this.success.set(true);
        this.name = '';
        this.email = '';
        this.message = '';
        setTimeout(() => this.success.set(false), 5000);
      } else {
        alert("Failed to send message. Please ensure the Access Key is valid.");
      }
    })
    .catch(error => {
      this.sending.set(false);
      alert("Something went wrong. Please try again later.");
      console.error(error);
    });
  }
}
