---
description: How to fix common lint errors in this project
---

# Fix Common Lint Errors

## Quick Reference

### 1. `@typescript-eslint/no-explicit-any` — No `any` types
```diff
- behavior: 'instant' as any
+ behavior: 'instant' as ScrollBehavior

- getData(params: any): void
+ getData(params: Record<string, string>): void
```

### 2. `@typescript-eslint/typedef` — Missing type annotation
Every `let` and `const` must have an explicit type:
```diff
- const items = this.portfolioService.getProjects();
+ const items: Array<Project> = this.portfolioService.getProjects();

- let loading = false;
+ public loading: boolean = false;  // at class level — no let/const
```

### 3. `no-restricted-imports` — Relative imports forbidden
Use path aliases defined in `tsconfig.json`. Never use `../../`:
```diff
- import { Project } from '../../shared/models/portfolio.models';
+ import { Project } from '@shared/models/portfolio.models';

- import { PortfolioService } from '../../core/services/portfolio.service';
+ import { PortfolioService } from '@services/portfolio.service';

- import { EN } from '../../i18n/en';
+ import { EN } from '@i18n/en';
```

### 4. `no-restricted-syntax` — Empty strings not allowed
```diff
- public name: string = '';
+ public name: string | null = null;

- public search: string = '';
+ public search: string | null = null;
```
Use `null` instead of `''` for initial/cleared state.

### 5. `@typescript-eslint/no-unused-vars` — Unused variables
Remove unused imports and variables. If intentionally unused, prefix with `_`:
```diff
- import { SomeUnusedModule } from '@angular/core';

- const unused: string = 'value';

- catchError((_error) => { ... })
+ catchError((_error: Error) => { ... })
```

### 6. `jsdoc/require-jsdoc` — Missing JSDoc
Add JSDoc to every class, public method, and private method:
```diff
+ /**
+  * Loads projects from the portfolio service.
+  *
+  * @returns void
+  */
  public ngOnInit(): void {
```

For methods with parameters:
```diff
+ /**
+  * Converts a hex color string to an RGB value string.
+  *
+  * @param hex - A hex color string (e.g. '#1a2b3c')
+  * @returns A comma-separated RGB string (e.g. '26, 43, 60')
+  */
  public hexToRgb(hex: string): string {
```

### 7. `import/order` — Wrong import order
Imports must be grouped and alphabetized within each group:
```
1. Angular core  (@angular/core, @angular/common, etc.)
2. Angular forms (@angular/forms)
3. Angular router (@angular/router)
4. RxJS          (rxjs)
5. Path aliases  (@i18n/*, @services/*, @shared/*, @utils/*)
```

Example — correct order:
```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { EN } from '@i18n/en';
import { PortfolioService } from '@services/portfolio.service';
import { Project } from '@shared/models/portfolio.models';
```

### 8. `no-console` — `console.log` not allowed
```diff
- console.log('debug value', value);
+ // remove it entirely, or use console.error only in error handlers:
  error: (err) => {
+   console.error('Failed to load data', err);
  }
```

### 9. Legacy structural directives — use control flow syntax
```diff
- <div *ngIf="show">...</div>
+ @if (show) { <div>...</div> }

- <div *ngFor="let item of items">
+ @for (item of items; track item.name) { <div> }
```

### 10. Inline styles in templates
Move all styles to the component's `.scss` file:
```diff
- <div style="color: red; font-size: 2rem;">
+ <div class="my-element">
  <!-- Then in .scss: -->
+ .my-element { color: red; font-size: 2rem; }
```

## Batch Fix

// turbo
Run lint to see all errors at once:
```bash
npm run lint
```

Some errors can be auto-fixed:
```bash
npx eslint --fix "src/**/*.ts"
```

> **Note**: `--fix` handles import ordering and some formatting, but type annotations, JSDoc, `any` replacements, and control flow migrations require manual fixes.
