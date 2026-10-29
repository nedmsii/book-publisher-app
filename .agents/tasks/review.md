# v2.1 teardown: database and admin portal removed, contact form emails via SES only

The refactor strips the book-publisher app down to a static-content site plus a single stateless contact endpoint. Prisma/PostgreSQL, NextAuth, the entire admin portal (routes, pages, components, API), and the `infrastructure/` deployment shell scripts are gone. The contact form now validates with Zod, drops honeypot hits, and hands off to AWS SES; there is no persistence and no DB fallback, so a failed send surfaces to the caller as a 500. Env wiring moved from `NEXTAUTH_URL` to `SITE_URL`, and `package.json` dropped every auth/DB/bcrypt dependency and the `prisma:*` scripts. No AWS resources are touched — this is code-only.

Watch for: the project is not a git repository, so the requested `git diff main` could not run (confirmed); the review was done against the working tree, the implementation note's recorded evidence, and direct file reads/grep instead. A minor, non-blocking leftover: `robots.ts` still disallows `/admin`, a route that no longer exists (confirmed).

**Verdict**: APPROVED

## High-level view

The eight deletion targets — `prisma/`, `src/lib/prisma.ts`, `src/lib/auth.ts`, `src/app/api/auth/`, `src/app/api/admin/`, `src/app/admin/`, `src/components/admin/`, and `infrastructure/` — are all absent from the working tree. Nothing outside the project root was removed, and the protected paths (`.kiro/`, `src/data/books.ts`, `src/i18n`, `public/images`) are all still present.

The contact endpoint is the one piece of live behavior left. It keeps the Zod `contactFormSchema` and the honeypot check, calls `sendContactNotification` with `submittedAt: new Date()`, and returns a 500 JSON error when SES throws. Because persistence is gone, the fail-closed behavior on a send error is the correct and only safe choice — the user is told to retry rather than silently losing their message. Success and validation response shapes are unchanged.

The SES module keeps its `submittedAt: Date` signature, HTML body, and `escapeHtml`. The default `fromEmail` is now `noreply@araji.com` and `toEmail` stays `bonahid@araji.com`. The admin-portal plain-text line was removed. Since this touches an outbound email trust boundary, note that both addresses are env-overridable (`SES_FROM_EMAIL`, `ADMIN_NOTIFICATION_EMAIL`) and all user-supplied fields are HTML-escaped in the HTML body; the plain-text body is not escaped but is not rendered as markup, so there is no injection surface there.

Auth is fully excised: `middleware.ts` no longer imports from `@/lib/auth` or next-auth, the admin-auth block and the `/admin` exclusion are gone, and the handler is now synchronous. The `/en` passthrough, Arabic-root rewrite to `/ar`, and the exported `config` matcher are preserved. Validation and type surfaces were trimmed to exactly the required set, and the `NEXTAUTH_URL` → `SITE_URL` rename landed in all four files. A grep across `src/` for the full list of removed symbols returns no matches.

<details>
<summary>Issues (1)</summary>

1. **Stale robots disallow (non-blocking)** — `src/app/robots.ts` still lists `/admin` in `disallow`; the admin route no longer exists so the rule is harmless, but it can be dropped for cleanliness. Out of the stated task scope, not a blocker.

</details>

<details>
<summary>Details</summary>

### Verification constraints and how this review was conducted

The task asked for a `git diff main`, but `book-publisher-app` is not a git repository (`git rev-parse` returns "not a git repository" — confirmed). There is no base branch to diff against, so the behavioral assessment rests on three sources: the implementation note's recorded evidence, direct reads of every edited file, and targeted filesystem/grep spot-checks. Per instructions, `npm install` and `npx tsc --noEmit` were not re-run — the note records them as RAN with `tsc` exit 0 and no diagnostics, and `npm install` confirming the removed packages absent from `node_modules` and `next-auth` gone from `package-lock.json`. That evidence is present and specific, so it stands.

### Teardown completeness

All eight deletion targets are confirmed gone via `Test-Path`: `prisma/`, `src/lib/prisma.ts`, `src/lib/auth.ts`, `src/app/api/auth/`, `src/app/api/admin/`, `src/app/admin/`, `src/components/admin/`, `infrastructure/`. The protected paths `.kiro/`, `src/data/books.ts`, `public/images`, and `src/i18n` all still exist, so nothing was over-deleted and nothing outside the project root was touched.

A grep over `src/**/*.{ts,tsx}` for `prisma`, `PrismaClient`, `@prisma/client`, `next-auth`, `NextAuth`, `getServerSession`, `@/lib/auth`, `@/lib/prisma`, `NEXTAUTH_URL`, `submissionStatusSchema`, `ContactSubmission`, and `AdminUser` returns zero matches, independently confirming the note's grep claim.

### Contact endpoint: stateless, fail-closed

`src/app/api/contact/route.ts` has no `@/lib/prisma` import and no `.contactSubmission.create` write. It parses the body, runs `contactFormSchema.safeParse`, and returns a 400 with a per-field `errors` map on validation failure. A non-empty honeypot short-circuits to a `{ success: true }` 200 without sending — the silent-success pattern that denies bots feedback. On a valid, non-bot submission it calls `sendContactNotification` with the five fields plus `submittedAt: new Date()`.

The SES call is wrapped so a throw returns a 500 JSON error rather than propagating. With the database gone there is no fallback store, so fail-closed (tell the user to retry) is the correct posture — the alternative would silently drop the message. Success returns the unchanged `{ success: true, message: "Thank you for your message. Ibrahim will be in touch soon." }` at 200. The `ipAddress`/`userAgent` reads that only fed the old DB write were dropped.

### SES module: trust boundary intact

`src/lib/ses.ts` keeps the `ContactNotificationData` signature with `submittedAt: Date`, the HTML body, and `escapeHtml`. The default `fromEmail` is now `noreply@araji.com` (env `SES_FROM_EMAIL`) and `toEmail` defaults to `bonahid@araji.com` (env `ADMIN_NOTIFICATION_EMAIL`). The "Log in to your admin portal to view and manage all submissions." line is removed from the text body.

Since this is an outbound-email boundary carrying user input: every user field (`name`, `email`, `subject`, `message`) is passed through `escapeHtml` in the HTML body, so there is no HTML/attribute injection into the rendered email. The plain-text body interpolates fields unescaped, which is expected for text/plain and carries no markup-injection risk. The region falls back to `us-east-1` if `AWS_REGION` is unset. No credentials are handled in code — the comment notes Amplify supplies role credentials at runtime.

### Auth excision in middleware

`src/middleware.ts` imports only `NextResponse` and `NextRequest` from `next/server` — no `@/lib/auth`, no next-auth, no `await auth()`. The handler is synchronous. `isExcludedPath` no longer lists `/admin`. The `/en` passthrough, the root-to-`/ar` rewrite (`pathname === "/" ? "/ar" : "/ar${pathname}"`), and the exported `config.matcher` are all preserved.

### Trimmed validation and type surfaces

`src/lib/validations.ts` retains `buildContactFormSchema`, `contactFormSchema`, `ContactFormValues`, and `ContactValidationMessages`; `submissionStatusSchema` is gone. `src/types/index.ts` keeps Book, Chapter, LocalizedString, FAQ, BreadcrumbItem, ContactFormData, and ApiResponse; `ContactSubmission` and `AdminUser` are removed.

### Env rename and dependency pruning

`SITE_URL` with the `?? "http://localhost:3000"` fallback is in place in `src/i18n/metadata.ts`, `src/lib/structured-data.ts`, `src/app/robots.ts`, and `src/app/sitemap.ts`; no `NEXTAUTH_URL` remains. `package.json` dependencies are now exactly `@aws-sdk/client-ses`, `next`, `react`, `react-dom`, `zod`, with the tailwind/eslint/typescript toolchain in devDependencies — `@auth/prisma-adapter`, `@prisma/client`, `bcryptjs`, `next-auth`, `@types/bcryptjs`, and `prisma` are all removed, as are the four `prisma:*` scripts.

Both `.env.example` (`SITE_URL="https://araji.com"`) and `.env.local.example` (`SITE_URL="http://localhost:3000"`) document `SITE_URL`, `AWS_REGION`, `SES_FROM_EMAIL=noreply@araji.com`, and `ADMIN_NOTIFICATION_EMAIL=bonahid@araji.com`, with the Database, NextAuth, and AWS access-key sections removed.

</details>

<details>
<summary>File map</summary>

Deleted: `prisma/`, `src/lib/prisma.ts`, `src/lib/auth.ts`, `src/app/api/auth/`, `src/app/api/admin/`, `src/app/admin/`, `src/components/admin/`, `infrastructure/`.

Edited:
- `src/app/api/contact/route.ts` — removed DB write; SES-only, fail-closed on send error.
- `src/lib/ses.ts` — default fromEmail → `noreply@araji.com`; admin-portal text line removed.
- `src/middleware.ts` — auth/next-auth removed; locale rewrite preserved.
- `src/lib/validations.ts` — `submissionStatusSchema` removed.
- `src/types/index.ts` — `ContactSubmission`, `AdminUser` removed.
- `src/i18n/metadata.ts`, `src/lib/structured-data.ts`, `src/app/robots.ts`, `src/app/sitemap.ts` — `NEXTAUTH_URL` → `SITE_URL`.
- `package.json` — auth/DB/bcrypt deps and `prisma:*` scripts removed.
- `.env.example`, `.env.local.example` — DB/NextAuth/access-key sections removed; `SITE_URL` + SES vars added.

Full diff: unavailable — project is not a git repository. Reviewed against the working tree and the implementation note at `.agents/tasks/implementation-note.md`.

</details>
