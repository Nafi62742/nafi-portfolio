# SYSTEM_ARCHITECTURE.md — Nafi Ahmed Portfolio
> Angular 17 standalone single-page portfolio. Read this before touching anything.

> [!IMPORTANT]
> **Developer Work Rules:**
> 1. **No Git Actions:** DO NOT run any Git commands (such as `git add`, `git commit`, `git push`, `git pull`). Staging, committing, and pushing/pulling must be managed manually by the user. Do not push, commit, or pull on GitHub.
> 2. **Do Not Build:** DO NOT run build commands (`npm run build` or `ng build`) during development unless explicitly requested or needed to check production bundle outputs.
> 3. **Run Lint After Every Change:** ALWAYS run the linter (`npm run lint` or `ng lint`) after making any code or styling changes to ensure zero warnings or errors are introduced.
> 4. **No Unnecessary Testing:** DO NOT test the project (e.g. running browser tests or launch tests) unless it is explicitly needed to debug a specific issue.

---

## Quick Start

```bash
npm install
npm start          # → http://localhost:4200
npm run build      # production build → dist/portfolio/
```

> **Assets:** PDF resumes are located in `src/assets/docs/Nafi_Ahmed_Resume.pdf` and `src/assets/docs/Nafi_Ahmed_Resume_DA.pdf`.

---

## Tech Stack

| Layer        | Choice                                         |
|--------------|------------------------------------------------|
| Framework    | Angular 17 (standalone components, no NgModule)|
| Styling      | SCSS with custom design system                 |
| State        | Angular Signals (`signal()`)                   |
| Animations   | Pure CSS keyframes + IntersectionObserver      |
| i18n         | Custom `TranslateService` (TypeScript constants)|
| Builder      | `@angular-devkit/build-angular:application`    |
| Icons        | FontAwesome 6 (CDN in `index.html`)            |
| Fonts        | Inter + Fira Code (Google Fonts CDN)           |

---

## Project Structure

```
i:\Job\my portfolio\
├── angular.json                  ← build config (application builder, src/assets)
├── tsconfig.json / tsconfig.app.json
├── package.json
├── SYSTEM_ARCHITECTURE.md        ← this file
│
└── src/
    ├── index.html                ← SEO meta, FontAwesome CDN, Google Fonts
    ├── main.ts                   ← bootstrapApplication(AppComponent, appConfig)
    ├── styles.scss               ← global reset, base typography, scrollbar
    │
    ├── styles/                   ← SCSS design system (imported by styles.scss)
    │   ├── _variables.scss       ← ALL design tokens (colors, spacing, fonts, breakpoints)
    │   ├── _mixins.scss          ← reusable mixins (glass, btn-primary, container, etc.)
    │   └── _animations.scss      ← keyframes + .reveal / .revealed scroll-trigger classes
    │
    ├── assets/
    │   ├── docs/
    │   │   ├── Nafi_Ahmed_Resume.pdf
    │   │   └── Nafi_Ahmed_Resume_DA.pdf
    │   └── images/
    │       ├── portfolio_logo.png
    │       └── game_logo.png
    │
    └── app/
        ├── app.config.ts         ← provideRouter, provideAnimations, provideHttpClient
        ├── app.component.ts      ← root router-outlet container
        ├── app.component.html    ← displays <router-outlet>
        │
        ├── routing/
        │   └── app.routes.ts     ← handles main single-page path plus nested details routes
        │
        ├── i18n/
        │   └── en.ts             ← ALL UI strings as typed TS constant EN { nav, hero, about, ... }
        │
        ├── services/
        │   ├── translate.service.ts  ← t(key), tArray(key), section(key) — dot-notation
        │   ├── theme.service.ts      ← signal-based dark/light, localStorage persist
        │   ├── scroll.service.ts     ← activeSection signal, isScrolled signal, scrollTo()
        │   └── portfolio.service.ts  ← ALL profile data (skills, experience, projects, etc.)
        ├── utils/
        │   ├── viewport.util.ts      ← initRevealObserver() — IntersectionObserver for .reveal
        │   └── animations.util.ts    ← startTypingAnimation(), clamp(), debounce()
        │
        ├── models/
        │   └── portfolio.models.ts   ← interfaces: SkillCategory, Experience, Project,
        │                                Publication, Education, Leadership, ContactForm
        │
        ├── shared-components/        ← global shared components
        │   ├── navbar/               ← fixed top; glass on scroll; hamburger; active-link
        │   ├── footer/               ← logo, copyright, built-with
        │   └── theme-toggle/         ← dark/light theme switch button
        │
        └── pages/                    ← route page components
            ├── main-portfolio/       ← shell assembling all section components on a single scroll page
            │
            ├── hero/                 ← full-screen; tagline with sub-bullets; avatar orbit ring
            ├── about/                ← bio paragraphs + 4 stat cards
            ├── skills/               ← 6 category cards with tech badges
            ├── experience/           ← vertical timeline (2 entries: full-time + intern)
            ├── projects/             ← 7 project cards; colored CSS var accent per card
            │   └── project-details/  ← details page nested inside projects
            ├── publications/         ← 2 research cards (IEEE + JSTR 2025)
            │   └── publication-details/ ← details page nested inside publications
            ├── education/            ← 3 edu cards + leadership sidebar
            └── contact/              ← info panel + contact form (simulated submit)
```

---

## Design System

### Color Tokens (`_variables.scss`)
| Variable        | Value       | Usage                        |
|-----------------|-------------|------------------------------|
| `$bg-base`      | `#080d1a`   | Page background              |
| `$bg-surface`   | `#0f1629`   | Alternating section bg       |
| `$bg-card`      | `#141e33`   | Card backgrounds             |
| `$primary`      | `#6366f1`   | Indigo — CTAs, accents       |
| `$accent`       | `#06b6d4`   | Cyan — secondary highlights  |
| `$text-primary` | `#f1f5f9`   | Body headings                |
| `$text-secondary`| `#94a3b8`  | Body paragraphs              |
| `$text-muted`   | `#64748b`   | Meta, labels                 |

**Sections alternate** between `$bg-base` and `$bg-surface` for visual separation.

### Key Mixins (`_mixins.scss`)
```scss
@include m.glass()        // backdrop-filter glassmorphism
@include m.glass-card     // glass + border-radius + hover lift
@include m.btn-primary    // gradient pill button
@include m.btn-outline    // ghost pill button
@include m.tech-badge     // small mono chip for tech tags
@include m.heading-gradient // gradient background-clip text
@include m.container      // max-width 1200px, centered, padded
@include m.sm / md / lg / xl  // responsive breakpoints
```

### Scroll Reveal
Any element with class `reveal` is invisible by default. `initRevealObserver()` (called in `AppComponent.ngOnInit`) adds `revealed` via IntersectionObserver when element enters viewport. Add `delay-1` through `delay-12` for stagger (80ms steps).

```html
<div class="reveal delay-2">Animates in on scroll</div>
```

---

## Data Flow

```
portfolio.service.ts  ──► Feature Component (injected)
                               │
                               ▼
en.ts (i18n)  ──► TranslateService.t(key)  ──► Template {{ t.t('hero.name') }}
                               │
ThemeService (signal) ──────────────────────────► [class.scrolled], data-theme attr
ScrollService (signal) ─────────────────────────► navbar active-link, isScrolled
```

---

## Adding / Editing Content

### Change profile data (skills, projects, experience, etc.)
→ Edit `src/app/core/services/portfolio.service.ts`

### Change UI text / labels
→ Edit `src/app/i18n/en.ts`

### Add a new language (e.g. Bengali)
1. Create `src/app/i18n/bn.ts` with same shape as `en.ts`
2. In `TranslateService`, import `BN` and add to `_translations`
3. Add a language toggle button to navbar calling `translateService.setLanguage('bn')`

### Add a new section
1. `ng generate component features/my-section --standalone --style=scss`
2. Add data method to `portfolio.service.ts`
3. Import and add `<app-my-section id="my-section">` in `app.component.html`
4. Add `'my-section'` to `ScrollService.sections` array
5. Add nav link in `NavbarComponent.navLinks`
6. Add i18n keys in `en.ts`

### Modify animations / transitions
→ Edit `src/styles/_animations.scss` (keyframes)
→ Edit `src/styles/_variables.scss` (`$transition-*` tokens)

---

## Section Order (DOM + Nav)

```
hero → about → skills → experience → projects → publications → education → contact
```

---

## Known Limitations / TODOs

- **Contact form** — submit is simulated (1.5s timeout). Wire to a real API (e.g. EmailJS, Formspree, or a backend endpoint) in `ContactComponent.onSubmit()`.
- **Resume download** — PDF files are located at `src/assets/docs/Nafi_Ahmed_Resume.pdf` and `src/assets/docs/Nafi_Ahmed_Resume_DA.pdf` for the download buttons.
- **Projects `hexToRgb()`** — used in template for dynamic `rgba()` backgrounds per project card. Lives in `projects.component.ts`.
- **`_hexToRgb.tmp`** — stray temp file in `src/app/features/projects/`, can be deleted.
- **Avatar orbit ring** in hero uses text "Fl" as Flutter placeholder — replace with a proper SVG icon if desired.
- **No routing** — SPA with anchor-scroll only. If multi-page routing is needed, add routes and lazy-load sections.
