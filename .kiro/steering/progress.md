---
inclusion: always
---

# Project Progress & Handoff (read first in any new session)

Last updated: October 2026. This file captures decisions and status so a fresh Kiro session can resume.

## Architecture (LOCKED — v2.1 serverless, no database, see .kiro/specs/design.md)
- Hosting: AWS Amplify (S3 + CloudFront + Lambda). NO EC2, NO RDS, NO VPC, NO DynamoDB.
- Contact form: SES email ONLY. No persistence/storage anywhere (user confirmed low volume, email-only, no backup). Send FROM `noreply@araji.com`, deliver TO `bonahid@araji.com`. SES us-east-1.
- Admin portal: REMOVED ENTIRELY (user decision Oct 28). No admin UI, no auth, no NextAuth, no credentials. New books are added once a year by editing `src/data/books.ts` in code.
- Book PDFs: S3 + CloudFront, shown in an embedded in-browser PDF reader on each book page (plus optional download).
- No CMS: content edited in code (`src/data/books.ts`, `src/i18n/dictionaries/*.ts`).
- Domain: `ibrahimaraji.com` registered in Route 53 (hosted zone Z0257072R4RE5ZV3UL36, verified). Amplify will handle ACM cert.

### v2.1 teardown scope (confirmed Oct 28)
REMOVE: Prisma (`prisma/`, `src/lib/prisma.ts`, package deps `@prisma/client`, `prisma`, `@auth/prisma-adapter`, prisma:* npm scripts), NextAuth/auth (`src/lib/auth.ts`, `src/app/api/auth/`, `next-auth`, `bcryptjs`, `@types/bcryptjs`), admin UI (`src/app/admin/`, `src/components/admin/`), admin API (`src/app/api/admin/`), old EC2/RDS/VPC infra scripts (`infrastructure/`). Remove admin guard block from `src/middleware.ts` (keep the i18n rewrite). Drop `submissionStatusSchema` from validations, `ContactSubmission`/`AdminUser` types. Rewrite `src/app/api/contact/route.ts` to validate + send SES email only (no prisma write; drop the "log in to admin portal" line in `src/lib/ses.ts` body). Env: keep AWS_REGION, SES_FROM_EMAIL=noreply@araji.com, ADMIN_NOTIFICATION_EMAIL=bonahid@araji.com; drop DATABASE_URL, NEXTAUTH_*. NOTE: `NEXTAUTH_URL` is reused as the site base URL in `metadata.ts`, `structured-data.ts`, `robots.ts`, `sitemap.ts` — rename to a neutral `SITE_URL` env var.

## Done
- Next.js 14.2.21 + TypeScript + Tailwind app; `npx tsc --noEmit` passes (exit 0).
- Bilingual i18n: Arabic default at `/`, English at `/en`, RTL, Noto Kufi Arabic font, hreflang, localized metadata/JSON-LD. Implemented via `src/app/[lang]/` + `src/middleware.ts` rewrite (`/` → `/ar`).
- Author name: Arabic **إبراهيم فواز عراجي** (NOT عرجي), English Ibrahim Fawaz Araji.
- 10 real books in `src/data/books.ts`, sortOrder = true publication order (1 oldest → 10 newest); displayed newest-first via `getBooksForDisplay()`.
- Real covers in `public/images/books/` (`quran-modern-sciences.jpg`, `road-to-god.jpg`, `islamic-masterpieces.jpg`, `my-village.jpg`, `araji-family-history.jpg`, `the-true-promise.jpg`, `in-the-embrace-of-islam.jpg`, `diary-of-time.jpg`, `diary-of-a-muslim.jpg`, `scientific-miracles.jpg`). VERIFY these slug-named files exist; the rename command may not have run — originals are `Book1.jpeg`..`Book10.jpg` (Book1=scientific-miracles, Book2=road-to-god, Book3=quran-modern-sciences, Book4=diary-of-time, Book5=islamic-masterpieces, Book6=the-true-promise, Book7=diary-of-a-muslim, Book8=araji-family-history, Book9=in-the-embrace-of-islam, Book10=my-village). Delete old 1KB `book-N.jpg` placeholders.
- Real bio (both languages) in `src/i18n/dictionaries/ar.ts` and `en.ts` `about` section; source doc: `public/images/publisher/نبذة عن حياة المؤلف.doc`.
- Author portrait: `public/images/publisher/ibrahim-fawaz-araji.jpg` (from Ibrahim_Fawaz_Araji-1.JPG) wired into About page.
- Years hidden when `publishedYear` is 0 (only 1998 and 2014 confirmed).
- AWS CLI v2 installed (`C:\Program Files\Amazon\AWSCLIV2\aws.exe`); user ran `aws configure` (region us-east-1) — verify with `aws sts get-caller-identity`.
- SES: `bonahid@araji.com` and domain `araji.com` VERIFIED (user did this). AWS Skills installed.

## Verified (Oct 28 2026 session)
- AWS creds OK: account 445476945051, IAM user ned.araji.
- SES: NO dedicated IPs or pools (no dedicated IP cost). Still in SANDBOX (ProductionAccessEnabled=false, 200/day, 1/sec) — user must request production access in SES console. VDM (Virtual Deliverability Manager) is ENABLED, which bills per email; user may want to disable it.
- Route 53 hosted zone exists: ibrahimaraji.com (Z0257072R4RE5ZV3UL36).
- Covers renamed to slug names; old `book-N.jpg` placeholders deleted. Matches `src/data/books.ts`.

## Next steps (in order)
1. (DONE) AWS creds / SES / Route 53 checks.
2. (DONE Oct 28) v2.1 teardown complete + reviewer-approved. Deleted prisma/, infrastructure/, src/lib/{prisma,auth}.ts, src/app/api/{auth,admin}/, src/app/admin/, src/components/admin/. Contact API is SES-only, fail-closed (failed send → 500, no DB fallback). Auth removed from middleware. ses.ts fromEmail default now noreply@araji.com. NEXTAUTH_URL→SITE_URL in metadata.ts/structured-data.ts/robots.ts/sitemap.ts. package.json + both .env examples cleaned. robots.ts no longer disallows /admin. `npx tsc --noEmit` = exit 0; src/ grep for all removed symbols = zero matches. NOTE: project is NOT a git repo (no commits made).
3. Embedded PDF reader once user provides PDFs/Word files (put in `public/books/` locally, S3 in prod).
4. Fill in real publish dates + summaries when user sends them.
5. Update `.kiro/specs/tasks.md` + `design.md` for v2.1 (no-DB) architecture.
6. SES: request production access in console (user action); optionally disable VDM.
7. Deploy to Amplify, connect ibrahimaraji.com.

## Environment notes
- Windows/PowerShell. Refresh PATH in commands: `$env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User")`.
- Local `next build` is slow/flaky in this environment; use `npx tsc --noEmit` for quick verification. Dev server: `npm run dev` (needs NEXTAUTH_URL, NEXTAUTH_SECRET env vars).
- Always confirm with the user before creating/deleting billable AWS resources.
