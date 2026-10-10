# Project Summary

One-page overview of what Koyama Shokai is, how it's built, and how it's deployed. For deeper detail, see the links at the bottom.

## What it is

**Koyama Shokai** is a hospital linen/patient-item **delivery request management system**. Hospitals subscribe to recurring **services** (e.g. a daily linen-exchange plan) built from concrete **sets** (specific items, by size/type), plus optional one-off **options** (add-on items sold by quantity). A **delivery request** ties a **patient** at a **hospital location** (a room, or — for hospitals that self-manage this — a classification/ward) to these services/options, generating a schedule of deliveries.

Four roles use the system:

| Role | Route prefix | Does |
| --- | --- | --- |
| **Admin** | `/admin` | Configures the whole catalog: branches, hospitals, leaders, services, sets, options, ACL. |
| **Leader** | `/leader` | Branch-scoped oversight: billing summary, distribution lists, read access to hospitals/catalog. |
| **Staff** | `/staff` | Fulfillment: creates and completes delivery requests. |
| **Hospital Staff** | `/hospital-staff` | The hospital's own users: confirm receipt of deliveries, register suspensions. |

This repository is the **frontend only** — a single-page application. There is no backend code in this repo; the API is a separate service the frontend calls over HTTPS.

## Tech stack (frontend)

| Layer | Choice |
| --- | --- |
| Framework | Angular 21 — standalone components, `ChangeDetectionStrategy.OnPush` throughout |
| Language | TypeScript 5.9, strict mode, no `any` |
| Styling | Tailwind CSS 3 + component SCSS |
| State | Plain RxJS observables + a couple of small app-wide services (`AuthStateService`, `GlobalUiService`) — no NgRx/Redux |
| Forms | Angular Reactive Forms |
| Auth | Cookie-based sessions (`HttpOnly` cookie set by the backend), every HTTP call sent with `withCredentials: true` |
| PDF export | `jspdf` + `jspdf-autotable` |
| Device detection | `ngx-device-detector` |
| UI language | Japanese for all user-facing text (centralized in `src/app/utils/ln/jp-localization.ts`); English for code/comments |
| Testing | Jasmine/Karma (`ng test`) |
| Linting | ESLint (`angular-eslint` + `typescript-eslint`), strict import-order and path-alias rules enforced — see `RULES.md` |

Path aliases (no relative `../../` imports): `@env/*`, `@models/*`, `@pages/*`, `@routing/*`, `@services/*`, `@shared-components/*`, `@utils/*`.

### Structure

```
src/app/
  pages/            admin/, common/, hospital-staff/, staff/   — routed page components, one folder per role (+ common)
  services/         one folder per domain (auth, hospital, room, service, service_set, option, branch, leader,
                    delivery, invoice-confirmation, total_bill, job, session, acl, dropdown, postcode)
  models/           TypeScript interfaces mirroring the backend's OpenAPI schemas
  shared-components/ header, sidebar, calendar, pagination, modals, toaster, loader, delivery-table, ...
  routing/          app.routes.ts — all routes, guarded by role/page/guest guards
  utils/            jp-localization, validation, constants, environment model
```

Custom generator scripts keep this structure consistent instead of raw `ng generate`:

| Command | Generates |
| --- | --- |
| `npm run g:page` | A routed page component |
| `npm run g:shared-component` | A standalone shared UI component |
| `npm run g:service` | An injectable `@Injectable` HTTP service |
| `npm run generate:models` | Resyncs `src/app/models/*` from the backend's `rest_api.yml` OpenAPI spec |

## Backend

There's no backend source in this repo — it's described declaratively by **`rest_api.yml`** (OpenAPI 3.0, "Koyama Shokai API") and consumed as a REST API over HTTPS. From that spec and `buildspec.yml`, the backend runs as:

- **AWS API Gateway** in front of **AWS Lambda** (every path, including a catch-all `/{proxy+}`, proxies to a single Lambda function per environment, e.g. `koyama-shokai-lambda-function-dev`), region `ap-northeast-1`.
- Session-based auth: `POST /auth/login` sets an `HttpOnly` cookie; `GET /auth/whoami` and `POST /auth/logout` read/clear it. Login responses carry a role id, `allowed_pages`, and `allowed_actions` used to drive route/page guards and demo mode.
- Long-running writes (create/update) return a `job_id`; a `JobService.pollJobUntilDone` exists for polling job completion (see "Known gaps" in `docs/INDEX.md` — most pages don't actually poll it yet).
- Domain areas exposed: auth, branches, hospitals, leaders, rooms, services/sets/options, delivery requests, invoice confirmation, total billing, sessions, ACL, jobs, health-check.

The frontend never talks to a local/embedded server — `environment.*.ts` files just point `api_url`/`ws_url` at one of three hosted API targets (dev/stage/live), selected at build time.

## Environments & deployment

| File | Target | API host |
| --- | --- | --- |
| `environment.dev.ts` | dev | CloudFront-fronted dev API (`https://d1szov22n1bdnc.cloudfront.net/api`) |
| `environment.stage.ts` | stage | staging API |
| `environment.prod.ts` | production | `https://koyama.com/api` |

CI/CD is AWS CodeBuild (`buildspec.yml`):

1. `npm install`, then `npm run build --configuration=<env>` (dev/stage/live via `ENVIRONMENT` var).
2. Static output (`dist/Koyama-Shokai-Angular/browser`) is synced to a versioned S3 prefix, `index.html` re-uploaded with no-cache headers, an S3 "latest" pointer updated, older versions pruned (keeps last 3), and CloudFront invalidated.

So the whole app is a static SPA served from S3 behind CloudFront, with the API living behind a separate CloudFront/API Gateway + Lambda stack.

## Auth & authorization model

- Login (`AuthService.loginApi`) posts credentials to `/auth/login`; the backend sets the session cookie and returns role + permission info, mapped into an `AuthState` (`role`, `allowedPages`, `allowedActions`, hospital/branch identifiers).
- `AuthService.me()` calls `/auth/whoami` on app load to restore session state from the cookie.
- Route guards (`RoleGuard`, `PageGuard`, `GuestGuard`, `RoleRedirectGuard`) gate access by role and by the `allowed_pages`/`allowed_actions` the backend returned at login.
- A `DEMO_MODE` flag exists in `AuthService` that can force every login into a demo mode (used for showcasing without real backend side effects).

## Known gaps / in-progress work

Kept in sync in `docs/INDEX.md` — notably: the ACL page is built but unrouted, job-polling is mostly unused, one distribution-list filter and a "sell" action are stubbed, and invoice-confirmation's "confirmed" state is currently session-local (not persisted).

## Where to go next

- **[docs/INDEX.md](INDEX.md)** — full documentation map: per-role pages (`docs/roles/`) and per-feature deep dives (`docs/features/`), plus the current known-gaps list.
- **[RULES.md](../RULES.md)** — the architecture/conventions "brain file": coding standards, generator usage, import rules, state-management patterns.
- **[.agents/workflows/](../.agents/workflows/)** — step-by-step recipes for common tasks (new page, new service, new model, fixing lint, pre-merge checklist, git branching).
- **`rest_api.yml`** — the authoritative API contract this frontend is generated/validated against.
