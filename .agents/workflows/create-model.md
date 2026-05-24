---
description: How to create or update model interfaces for the portfolio domain
---

# Create or Update Model Interfaces

All models live in a **single file**: `src/app/shared/models/portfolio.models.ts`.
Do not create separate `.model.ts` files per domain — the portfolio is a single domain.

## Steps

1. **Identify the shape** of the new data (from the feature you're building or the service data).

2. **Open the model file** at `src/app/shared/models/portfolio.models.ts` and add your interface.

Rules:
- Export only **interfaces** (no classes, no enums, no type aliases unless for a union)
- Use explicit types: `string`, `number`, `boolean`, `Array<T>`
- Mark optional fields with `?`
- Use string literal union types for fixed values: `category: 'office' | 'personal'`
- Null is allowed for "not yet set" values: `endDate: string | null`
- Group related fields visually with alignment (see existing models for style)

Naming conventions:
| Pattern | Example |
|---------|---------|
| Domain entity | `Project`, `Publication`, `Education` |
| Form shape | `ContactForm` |
| Category/sub-type | `SkillCategory`, `Experience` |

3. **Example model addition**:

```typescript
/**
 * Represents a single testimonial entry.
 */
export interface Testimonial {
  name:        string;
  role:        string;
  company:     string;
  quote:       string;
  avatarUrl?:  string;
}
```

4. **After adding the model**, update `portfolio.service.ts` to return or use the new type.

> **Note**: Never use `any` for model fields. If the shape is unknown, use `unknown` and narrow it at the call site.
