# v2.1 Teardown — Implementation Note

Code-only refactor: removed the database (Prisma/PostgreSQL) and the admin portal.
The contact form now emails the author via AWS SES only, with no persistence.
No AWS resources were created or deleted.

Iteration: FIRST (no `.agents/tasks/review.json` present).

## Deleted (files/dirs)

- `prisma/` (whole folder — schema.prisma, seed.ts)
- `src/lib/prisma.ts`
- `src/lib/auth.ts`
- `src/app/api/auth/` (whole folder — `[...nextauth]/route.ts`)
- `src/app/api/admin/` (whole folder — `submissions/[id]/route.ts`)
- `src/app/admin/` (whole folder — layout.tsx, page.tsx, login/page.tsx)
- `src/components/admin/` (whole folder — SubmissionsTable.tsx)
- `infrastructure/` (whole folder — EC2/RDS/VPC shell scripts, ecosystem.config.js, nginx.conf)

## Edited

- **src/app/api/contact/route.ts** — Rewrote. Removed `@/lib/prisma` import and the
  `prisma.contactSubmission.create(...)` write. Kept Zod validation (`contactFormSchema`)
  and honeypot check. After validation + honeypot, calls `sendContactNotification(...)`
  with `submittedAt: new Date()`. A thrown SES error now returns a 500 JSON error (no DB
  fallback). Validation/success JSON response shapes unchanged. Dropped the `ipAddress`/
  `userAgent` reads since they were only used by the removed DB write.
- **src/lib/ses.ts** — Changed default `fromEmail` from `bonahid@araji.com` to
  `noreply@araji.com`. `toEmail` default stays `bonahid@araji.com`. Removed the trailing
  plain-text line "Log in to your admin portal to view and manage all submissions." HTML
  body, `escapeHtml`, and the `submittedAt: Date` signature left as-is.
- **src/middleware.ts** — Removed `import { auth } from "@/lib/auth";` and the entire
  admin-auth block. Removed the `/admin` entry from `isExcludedPath` (admin routes no
  longer exist). Made the handler synchronous (no more `await auth()`). Kept the `/en`
  passthrough, the Arabic root rewrite to `/ar`, and the exported `config` matcher. No
  longer imports or calls anything from next-auth.
- **src/lib/validations.ts** — Removed `submissionStatusSchema`. Kept
  `buildContactFormSchema`, `contactFormSchema`, `ContactFormValues`,
  `ContactValidationMessages`.
- **src/types/index.ts** — Removed `ContactSubmission` and `AdminUser` interfaces. Kept
  Book, Chapter, LocalizedString, FAQ, BreadcrumbItem, ContactFormData, ApiResponse.
- **Env var rename `NEXTAUTH_URL` → `SITE_URL`** (`process.env.SITE_URL ?? "http://localhost:3000"`):
  - src/i18n/metadata.ts (`siteUrl`)
  - src/lib/structured-data.ts (`SITE_URL`)
  - src/app/robots.ts (`BASE_URL`)
  - src/app/sitemap.ts (`BASE_URL`)
- **package.json** — Removed deps `@auth/prisma-adapter`, `@prisma/client`, `bcryptjs`,
  `next-auth`; removed devDeps `@types/bcryptjs`, `prisma`; removed scripts
  `prisma:generate`, `prisma:migrate`, `prisma:seed`, `prisma:studio`. Kept
  `@aws-sdk/client-ses`, next, react, react-dom, zod, and the tailwind/eslint/typescript toolchain.
- **.env.example** — Removed Database, NextAuth, and AWS access-key sections. Now documents
  `SITE_URL`, `AWS_REGION`, `SES_FROM_EMAIL=noreply@araji.com`,
  `ADMIN_NOTIFICATION_EMAIL=bonahid@araji.com`.
- **.env.local.example** — Same treatment: `SITE_URL`, `AWS_REGION`, SES vars; no DB/NextAuth,
  no AWS access keys.

## Verification

- **npm install** — RAN successfully. Confirmed removed packages are gone from
  `node_modules` (prisma, @prisma/client, next-auth, bcryptjs all absent) and `next-auth`
  no longer appears in `package-lock.json`.
- **npx tsc --noEmit** — RAN. Output: no diagnostics. Exit code: `0`. (Authoritative check
  in this environment; `next build` is slow/flaky locally.)
- **grep over src/** for `prisma`, `PrismaClient`, `@prisma/client`, `next-auth`, `NextAuth`,
  `getServerSession`, `@/lib/auth`, `@/lib/prisma`, `NEXTAUTH_URL`, `submissionStatusSchema`,
  `ContactSubmission`, `AdminUser` — **No matches found.**

## Not touched (per instructions)

- `.kiro/` (specs/steering), `src/data/books.ts` content, i18n dictionaries, `public/images`.
- No AWS resources created; nothing deleted outside the project root.
