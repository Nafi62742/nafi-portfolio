---
description: Pre-merge quality checklist before committing changes
---

# Pre-Merge Checklist

Run through this checklist before committing or pushing any changes.

## Automated Checks

// turbo
1. **Run lint** — must pass with zero errors:
```bash
npm run lint
```

// turbo
2. **Run build** — must compile without errors:
```bash
npm run build
```

## Manual Checks

3. **No `any` types** — every variable, parameter, and return type must have an explicit type annotation. ESLint enforces this, but double-check edge cases like `as any` casts in templates.

4. **JSDoc on all methods** — every public and private method must have:
   - A description line
   - `@param` tags for each parameter (with description)
   - `@returns` tag describing the return value

5. **No relative imports** — all imports must use path aliases:
   - ✅ `import { Project } from '@shared/models/portfolio.models';`
   - ✅ `import { EN } from '@i18n/en';`
   - ✅ `import { PortfolioService } from '@services/portfolio.service';`
   - ❌ `import { Project } from '../../shared/models/portfolio.models';`
   - ❌ `import { EN } from '../i18n/en';`

6. **No unused imports/variables** — remove anything not referenced in the file.

7. **No `console.log`** — only `console.error` is allowed (in error handlers only).

8. **No `*ngIf` / `*ngFor`** — only `@if` / `@for` control flow blocks are allowed.

9. **No inline styles in HTML** — all styles must live in the component's `.scss` file.

10. **No hardcoded UI strings** — all user-facing text must come from `EN` in `src/app/i18n/en.ts`:
    - ✅ `{{ labels.title }}`
    - ❌ `'Things I've Built'` directly in template

11. **Route paths** — any new routed page must be added to `src/app/app.routes.ts`. Paths follow the pattern `'<section>/:id'` for detail pages.

12. **Loading & error states** — every async or reactive operation must handle:
    - A loading indicator while data resolves
    - An error/empty state if data is unavailable
    - `cd.detectChanges()` after async operations if using `OnPush` or signals

13. **Orphaned files** — ensure no dead components exist that are:
    - Not imported in `main-portfolio.component.ts`, AND
    - Not referenced in `app.routes.ts`
    - Search with: `grep -r "ComponentName" src/`

14. **Signals vs properties** — use Angular `signal<T>()` for state that changes after interaction (e.g., selected project). Use plain class properties for static data loaded once in `ngOnInit`.

15. **No empty lifecycle methods** — remove `ngOnInit()` (or other lifecycle hooks) if the body is empty.
