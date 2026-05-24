---
description: How to create a new page or section component in the portfolio
---

# Create a New Page / Section Component

Components (feature sections and detail pages) live at `src/app/features/<component-name>/`.

Existing features:
- `main-portfolio/` — the main single-page shell (hosts all sections)
- `hero/`, `about/`, `skills/`, `experience/`, `projects/`, `publications/`, `education/`, `contact/`, `footer/`, `navbar/`
- `project-details/`, `publication-details/` — standalone detail pages (routed)

## Steps

// turbo
1. **Generate the component** using the Angular CLI:
```bash
npx ng generate component features/<component-name> --standalone
```
Example: `npx ng generate component features/testimonials --standalone`

2. **Open the generated `.ts` file** and set it up with proper structure:

```typescript
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EN } from '@i18n/en';
import { PortfolioService } from '@services/portfolio.service';
import { MyModel } from '@shared/models/portfolio.models';

/**
 * Testimonials section component.
 * Displays client or peer testimonials from the portfolio service.
 */
@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss'
})
export class TestimonialsComponent implements OnInit {
  /** i18n labels for this section. */
  public readonly labels: typeof EN.testimonials = EN.testimonials;

  /** All testimonial items loaded from the portfolio service. */
  public items: Array<MyModel> = [];

  /**
   * @param portfolioService - Portfolio data service
   * @param cd - Change detector for manual change detection
   */
  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly cd: ChangeDetectorRef
  ) {}

  /**
   * Angular lifecycle hook — loads initial data.
   *
   * @returns void
   */
  public ngOnInit(): void {
    this.items = this.portfolioService.getTestimonials();
    this.cd.detectChanges();
  }
}
```

3. **Add i18n labels** in `src/app/i18n/en.ts` for the new section:

```typescript
testimonials: {
  section_label: 'Testimonials',
  title:         'What People Say',
  subtitle:      'Feedback from colleagues and clients.'
}
```

> Labels must always reference `EN.<section>` — never hardcode strings in components or templates.

4. **Register the route** (only for full detail pages, not section components) in `src/app/app.routes.ts`:

```typescript
{ path: 'testimonial/:id', component: TestimonialDetailComponent }
```

5. **Embed the section** in `main-portfolio.component.html` if it's a section (not a detail page):

```html
<app-testimonials></app-testimonials>
```

And import it in `main-portfolio.component.ts`.

6. **Set up the HTML template** — no inline styles, use semantic class names:

```html
<section class="ts-section" id="testimonials">
  <div class="ts-header">
    <span class="ts-label">{{ labels.section_label }}</span>
    <h2 class="ts-title">{{ labels.title }}</h2>
    <p class="ts-subtitle">{{ labels.subtitle }}</p>
  </div>

  @if (items.length === 0) {
    <p class="ts-empty">No items to display.</p>
  }

  @for (item of items; track item.name) {
    <div class="ts-card">
      <!-- card content -->
    </div>
  }
</section>
```

7. **Define all styles in the `.scss` file** — no inline Tailwind in templates:

```scss
.ts-section {
  padding: 5rem 2rem;
}

.ts-title {
  font-size: 2rem;
  font-weight: 700;
}

.ts-empty {
  text-align: center;
  color: var(--text-muted);
  padding: 3rem 0;
}
```

// turbo
8. **Run lint** to verify:
```bash
npm run lint
```
