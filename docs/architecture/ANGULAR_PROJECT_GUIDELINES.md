# Angular Standalone Project Blueprint & Reference Guide

This document serves as an architectural blueprint and reference guide for bootstrapping and developing new lightweight, highly performant, standalone Angular (v17+) applications. It generalizes the design patterns, Signal-based state management, custom lightweight translation system, and viewport-driven animation systems used in the portfolio codebase.

---

## 1. Project Initialization & Tooling

To start a new project following this template, initialize it using the Angular CLI:

```bash
# Initialize a new project with standalone components, SCSS, and routing
ng new <project-name> --standalone --routing --style=scss --prefix=app

# Install standard workspace linters
npm install -D @angular-eslint/builder @angular-eslint/eslint-plugin @angular-eslint/template-parser eslint
ng add @angular-eslint/schematics
```

### Essential Dev Rules
1. **Always Lint:** Run the linter (`npm run lint` or `ng lint`) after making changes to verify there are zero warnings or errors.
2. **Strict Typing:** Never use `any`. Define strong interfaces under `src/app/core/models/`.
3. **No Hidden State:** Rely on Angular Signals for UI states (theme, active paths, responsive state) and services for business data.

---

## 2. Directory Structure

Maintain a clean separation between **Core** systems (global singletons, configs, utils, services), **Shared** components (reusable UI elements), and **Features** (lazy-loaded pages or sections).

```
src/
├── index.html                   # Entry HTML (Meta tags, CDN fonts/icons)
├── main.ts                     # Application bootstrap (standalone mode)
├── styles.scss                 # Global resets, base typography, and SCSS imports
│
├── styles/                     # Global SCSS Design System
│   ├── _variables.scss         # Design tokens (colors, fonts, transitions, breakpoints)
│   ├── _mixins.scss            # Reusable UI mixins (glassmorphism, buttons, grids)
│   └── _animations.scss        # CSS keyframes and Scroll Reveal classes
│
└── app/
    ├── app.config.ts           # Bootstrapping providers (routes, animations, HTTP)
    ├── app.component.ts        # Root layout wrapper
    ├── app.component.html      # Outer template (<router-outlet>)
    │
    ├── core/                   # Singletons & structural logic
    │   ├── models/             # Strictly typed interfaces and type definitions
    │   ├── services/           # Global services (Theme, Translation, Viewport/Scroll)
    │   └── utils/              # Helper utilities (IntersectionObserver, text animators)
    │
    ├── shared/                 # Reusable UI components
    │   ├── navbar/             # Sticky navigation with glassmorphism and scroll-tracking
    │   ├── footer/             # Global footer
    │   └── theme-toggle/       # Visual switch for Light/Dark mode
    │
    └── features/               # Core features or page modules (lazy loaded)
        ├── home/               # Landing/Hero page
        └── project-details/    # Nested details sub-route
```

---

## 3. The Design System & SCSS

To ensure consistent UI/UX, do not use ad-hoc utility classes or inline styles. Declare design variables and abstract components as mixins.

### A. Design Tokens (`src/styles/_variables.scss`)
Define HSL or HEX tokens for colors, spacing, and transitions. Implement CSS Custom Properties so themes can be switched dynamically.

```scss
// Theme-independent variables
$font-sans: 'Inter', sans-serif;
$font-mono: 'Fira Code', monospace;
$transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
$transition-bounce: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);

// Breakpoints
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;

// Theme specific colors mapping (scoped in :root / [data-theme="dark"])
:root {
  --bg-base: #ffffff;
  --bg-surface: #f8fafc;
  --bg-card: #ffffff;
  --primary: #4f46e5; // Indigo
  --accent: #06b6d4;  // Cyan
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --border-color: #e2e8f0;
  --shadow-color: rgba(0, 0, 0, 0.05);
}

[data-theme="dark"] {
  --bg-base: #080d1a;
  --bg-surface: #0f1629;
  --bg-card: #141e33;
  --primary: #6366f1;
  --accent: #06b6d4;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --border-color: #1e293b;
  --shadow-color: rgba(0, 0, 0, 0.3);
}
```

### B. Mixins (`src/styles/_mixins.scss`)
Create reusable decorators to encapsulate premium styles like Glassmorphism and gradients.

```scss
@mixin glass() {
  background: rgba(var(--bg-card), 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
}

@mixin glass-card() {
  @include glass;
  border-radius: 16px;
  box-shadow: 0 4px 30px var(--shadow-color);
  transition: $transition-smooth;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 40px var(--shadow-color);
  }
}

@mixin heading-gradient() {
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@mixin responsive($limit) {
  @media (max-width: $limit) {
    @content;
  }
}
```

---

## 4. Signal-Based Global States

Use Angular Signals (`signal`, `computed`, `effect`) inside services to manage global state with minimal change detection footprint.

### A. Theme Management (`src/app/core/services/theme.service.ts`)
```typescript
import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  readonly themeSignal = signal<'light' | 'dark'>('dark');

  constructor() {
    // Read cached theme or system preferences
    const cached = localStorage.getItem('theme');
    if (cached === 'light' || cached === 'dark') {
      this.themeSignal.set(cached);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.themeSignal.set(prefersDark ? 'dark' : 'light');
    }

    // Reactively update HTML document attribute
    effect(() => {
      const activeTheme = this.themeSignal();
      document.documentElement.setAttribute('data-theme', activeTheme);
      localStorage.setItem('theme', activeTheme);
    });
  }

  toggleTheme() {
    this.themeSignal.update(current => current === 'dark' ? 'light' : 'dark');
  }

  isDark() {
    return this.themeSignal() === 'dark';
  }
}
```

### B. Viewport Scroll Observer (`src/app/core/services/scroll.service.ts`)
Track navbar background changes and current active section in standard single-page sites.

```typescript
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  readonly activeSection = signal<string>('hero');
  readonly isScrolled = signal<boolean>(false);

  constructor() {
    window.addEventListener('scroll', () => {
      this.isScrolled.set(window.scrollY > 50);
    });
  }

  setActiveSection(sectionId: string) {
    this.activeSection.set(sectionId);
  }

  scrollTo(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
```

---

## 5. Lightweight Typed Translation (i18n)

Instead of loading dynamic JSON files over HTTP, use strongly typed TypeScript dictionaries for static content. This guarantees build-time validation, autocomplete, and instant loading.

### A. Language Dict Constants (`src/app/core/i18n/en.ts`)
Define static translations inside dictionary files:

```typescript
export const EN = {
  nav: {
    home: 'Home',
    about: 'About',
    projects: 'Projects'
  },
  hero: {
    title: 'Hello, World!',
    subtitle: 'Building responsive applications using clean architectures.'
  }
};

export type TranslationType = typeof EN;
```

### B. Translation Service (`src/app/core/services/translate.service.ts`)
```typescript
import { Injectable, signal } from '@angular/core';
import { EN, TranslationType } from '../i18n/en';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  // Signal tracks current dictionary
  readonly translations = signal<TranslationType>(EN);
  readonly currentLanguage = signal<string>('en');

  setLanguage(lang: string) {
    if (lang === 'en') {
      this.translations.set(EN);
      this.currentLanguage.set('en');
    }
    // Add additional languages dynamically here
  }

  /**
   * Safe getter for translations with dot-notation fallback
   */
  t(path: string): string {
    try {
      const keys = path.split('.');
      let result: any = this.translations();
      for (const key of keys) {
        result = result[key];
      }
      return result || path;
    } catch {
      return path;
    }
  }
}
```

---

## 6. Viewport Reveal Animations

Use `IntersectionObserver` to trigger entrance animations. This technique avoids heavy third-party animation libraries.

### A. Utilities (`src/app/core/utils/viewport.util.ts`)
```typescript
/**
 * Observes DOM elements with a given selector and toggles class on enter
 */
export function initRevealObserver(selector: string = '.reveal', activeClass: string = 'revealed') {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add(activeClass);
        // Stop observing once animated
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll(selector).forEach((el) => observer.observe(el));
  return observer;
}
```

### B. SCSS Reveal Styling (`src/styles/_animations.scss`)
```scss
// Animation classes
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: opacity, transform;

  &.revealed {
    opacity: 1;
    transform: translateY(0);
  }

  // Stagger delays (80ms steps)
  @for $i from 1 through 12 {
    &.delay-#{$i} {
      transition-delay: #{$i * 80}ms;
    }
  }
}
```

### C. Usage in Component
1. Add `.reveal` class to HTML markup with an optional `.delay-X` helper:
```html
<div class="card reveal delay-3">
  <h3>Card Title</h3>
  <p>Animates gracefully when scrolled into view.</p>
</div>
```
2. Initialize observer in the main parent page component:
```typescript
import { Component, OnInit } from '@angular/core';
import { initRevealObserver } from '../../core/utils/viewport.util';

@Component({
  selector: 'app-main-page',
  standalone: true,
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  ngOnInit() {
    // Run observer setup when viewport is ready
    setTimeout(() => initRevealObserver(), 100);
  }
}
```

---

## 7. Adding New Features: Step-by-Step

Follow these steps when creating a new page section or feature:

1. **Generate Component:**
   ```bash
   ng generate component features/my-new-section --standalone --style=scss
   ```
2. **Declare Content Interfaces:**
   Create or edit model files under `core/models/` (e.g. `user-settings.model.ts`).
3. **Register i18n Translation Strings:**
   Add labels and headers to translations under `core/i18n/en.ts`.
4. **Wire State to Services:**
   Expose methods in global data/scroll services to fetch state or track page scroll tags.
5. **Import/Nest in Parent Shell:**
   Import standard component classes directly inside the `imports` array of the parent Component decorator:
   ```typescript
   import { MyNewSectionComponent } from '../features/my-new-section/my-new-section.component';

   @Component({
     imports: [MyNewSectionComponent],
     standalone: true
     // ...
   })
   ```

---

## 8. Development Verification Checklist

Before creating a pull request or requesting code reviews, run these validation steps:
- [ ] **Linter Check:** Execute `npm run lint` and ensure there are no style or type issues.
- [ ] **AOT Build Check:** Run `ng build --configuration production` to ensure AoT template compilation passes.
- [ ] **Lightweight State Review:** Confirm all signal mutations are encapsulated inside services and templates only call getters/signals.
- [ ] **Responsive Visuals:** Test on viewport layouts ($breakpoint-sm, $breakpoint-md, $breakpoint-lg).
- [ ] **Performance Review:** Ensure static SVGs are used instead of custom font-kits, Google fonts use `display=swap`, and dynamic images have modern fallback dimensions.
