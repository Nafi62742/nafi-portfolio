---
description: How to create a new service in the portfolio project
---

# Create a New Service

Services live at `src/app/core/services/<name>.service.ts`.

Existing services:
- `portfolio.service.ts` — all static portfolio data (projects, publications, skills, etc.)
- `scroll.service.ts` — smooth scrolling between sections
- `theme.service.ts` — light/dark theme management
- `translate.service.ts` — i18n / language switching

## Steps

// turbo
1. **Generate the service** using the Angular CLI:
```bash
npx ng generate service core/services/<name>
```
Example: `npx ng generate service core/services/analytics`

2. **Implement the service** at `src/app/core/services/<name>.service.ts`:

```typescript
import { Injectable } from '@angular/core';

import { MyModel } from '@shared/models/portfolio.models';

/**
 * Service responsible for <description>.
 */
@Injectable({ providedIn: 'root' })
export class MyService {

  /**
   * Returns <description>.
   *
   * @returns Array of MyModel items
   */
  getItems(): Array<MyModel> {
    return [];
  }
}
```

Rules:
- Always `{ providedIn: 'root' }`
- Always return explicit types — never `any`
- JSDoc on the class and all public methods
- Use path alias `@shared/models/portfolio.models` (not relative imports)
- For data-only services (like `portfolio.service.ts`), use plain arrays/objects — no `HttpClient`
- For future API calls, return `Observable<T>` and use `HttpClient`

3. **Add i18n labels** in `src/app/i18n/en.ts` for any new user-facing strings in the section:

```typescript
export const EN = {
  // ... existing sections
  mySection: {
    title:    'Section Title',
    subtitle: 'A short description.',
    empty:    'No items found.'
  }
};
```

4. **Wire up in the component**:
   - Inject via constructor: `private readonly myService: MyService`
   - Call in `ngOnInit()` or on user interaction

// turbo
5. **Run lint** to verify:
```bash
npm run lint
```
