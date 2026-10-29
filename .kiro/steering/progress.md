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
1b. (DONE Oct 28) Git initialized locally (branch `main`, no remote yet). Local identity set repo-only: user.name "Ibrahim Araji", user.email bonahid@araji.com (NOT global). Two commits: c0f050b initial, 6207743 scratch cleanup. `.gitignore` now excludes *.log, *.ps1, scratch files. NO GitHub account/remote yet — needed later for Amplify deploy (user will create free GitHub account at that step).

2. (DONE Oct 28) v2.1 teardown complete + reviewer-approved. Deleted prisma/, infrastructure/, src/lib/{prisma,auth}.ts, src/app/api/{auth,admin}/, src/app/admin/, src/components/admin/. Contact API is SES-only, fail-closed (failed send → 500, no DB fallback). Auth removed from middleware. ses.ts fromEmail default now noreply@araji.com. NEXTAUTH_URL→SITE_URL in metadata.ts/structured-data.ts/robots.ts/sitemap.ts. package.json + both .env examples cleaned. robots.ts no longer disallows /admin. `npx tsc --noEmit` = exit 0; src/ grep for all removed symbols = zero matches. NOTE: project is NOT a git repo (no commits made).
3. Embedded PDF reader once user provides PDFs/Word files (put in `public/books/` locally, S3 in prod).
4. (PARTIAL Oct 28) Author bio: user added 2 .doc bios in public/PDF_Books/ — they are BYTE-IDENTICAL duplicates (3847 chars each, verified). Extracted via Word COM (no python/pdftotext on machine). Canonical merged bilingual bio saved at public/images/publisher/author-bio.md. Site About bio (ar.ts/en.ts about.bio) was already in sync; fixed a factual error: birthplace is برالياس / Bar Elias (NOT بريتال/Brital). First book's exact date confirmed in bio: 17 Apr 1998 (1 Ramadan 1408 AH). STILL PENDING: real publish dates for the other 8 books + official summaries (user will send later → using "coming soon" placeholders meanwhile).
   PDFs: user uploaded 5 of 10 book PDFs to public/PDF_Books/ (Arabic filenames). Mapping → my-village, diary-of-a-muslim, the-true-promise, diary-of-time, in-the-embrace-of-islam. Other 5 pending.
   "Coming soon" placeholders (user decision): show "Publication date coming soon"/"تاريخ النشر قريباً" where publishedYear==0 (was hidden before), and "Full book coming soon"/"الكتاب كاملاً قريباً" for books without a PDF. Being implemented via workflow (wf_603ce194957159f2).
   Preview: dev server running via background process on http://localhost:3000 (AR) and /en (EN).
   DONE Oct 28: placeholders + 5 PDFs wired (commit 8f81375). Verified live: homepage, /en, /books, /en/books, book detail all HTTP 200; PDF at /books/my-village-memory-and-longing.pdf serves 200 application/pdf (12.6MB).
   TWO BUGS found by loading the actual page (tsc alone missed both — lesson: verify runtime, not just types):
   (a) RSC serialization: i18n dicts had FUNCTION values (showingAll, showingSome, readMoreAria, shareOn, coverAlt, footer.rights) passed from server→client components → 500 on every page. Fixed by converting them to plain string templates with {token} placeholders + .replace() at call sites. NO `=>` remain inside the dictionary objects. Keep this invariant: dictionaries must stay JSON-serializable (no functions) because they cross the server/client boundary.
   (b) Static PDFs under public/books/ 404'd because src/middleware.ts rewrote non-/en paths to /ar. Fixed by adding `pathname.startsWith("/books/")` to isExcludedPath (alongside /images/). Any NEW top-level public/ asset dir must be added to isExcludedPath too.
   BUG (c) fixed Oct 28, commit e4da705: NO root src/app/layout.tsx existed (only src/app/[lang]/layout.tsx). App Router REQUIRES a root layout; without it the top-level src/app/not-found.tsx (used for unmatched routes) 500'd with "not-found.tsx doesn't have a root layout", cascading 500s to all pages. Fixed by adding a pass-through root layout (returns children) — the [lang] layout and not-found/global-error render their own html/body. This is the 3rd runtime bug tsc could not catch. Do NOT delete src/app/layout.tsx. NOTE: the "Next.js is outdated" banner the user saw was the dev overlay mislabeling this runtime error — real cause was the missing root layout.
   Windows/dev-server note: `npm run dev` child node process can orphan and hold the port after the managed shell "exits"; restarting then drifts to 3001/3002. If that happens, kill the node PIDs on those ports (Get-NetTCPConnection -State Listen -LocalPort 3000,3001,3002 → Stop-Process) then start one fresh. Current clean server = terminal 4 on :3000.
5. (DONE Oct 28, commit 34cc73e) Rewrote all 3 spec docs (requirements/design/tasks) to v2.1 (no DB, no admin, SES-only, Amplify). Also untracked the 5 book PDFs from git (still on disk, gitignored via /public/books/*.pdf) — they go to S3+CloudFront in prod per design.md.
6. SES: DECISION Oct 28 — STAY IN SANDBOX, production access NOT needed. The form sends FROM noreply@araji.com (covered by verified DOMAIN araji.com, SendingEnabled=true) TO bonahid@araji.com (verified). Both sides satisfy sandbox rules; 200/day cap >> low form volume. Would only need production if we add an auto-reply TO the visitor (arbitrary unverified recipient) — not in scope. VDM still ENABLED (optional to disable for cost).
   GitHub account for Amplify: username nedmsii, email ned@themarketingscience.com.
   PDFs: use the current 5; remaining 5 to come later (owner).
7. Deploy to Amplify, connect ibrahimaraji.com. DEPLOY PREP DONE Oct 28 (commits 60965b1, 912b4fb): added amplify.yml (SSR build spec), DEPLOY.md (full step-by-step), scripts/upload-book-pdfs.ps1 (S3 upload). Fixed .gitignore so scripts/*.ps1 is tracked (root-only *.ps1 scratch ignore via /*.ps1 + !/scripts/*.ps1).
   PRODUCTION BUILD VERIFIED: `npm run build` exits 0, 34 static pages generated, routes correct (no admin/auth). NOTE: must kill the dev server first — it locks .next\trace and causes EPERM (this is the "flaky build" issue; not a code problem). AWS SDK warns Node>=22 required for releases after ~Jan 2027; on Node 20 now — bump Amplify build image + local to Node 22 around then.
   REMAINING OWNER STEPS before deploy: push repo to GitHub (nedmsii), create Amplify app + set 4 env vars + grant ses:SendEmail to the SSR compute role, run the S3 upload script + wire /books/* via CloudFront/Amplify rewrite, add ibrahimaraji.com domain. All detailed in DEPLOY.md.
   Dev server is currently STOPPED (was terminal 4; killed for the clean build). Restart with `npm run dev` when previewing again.

## Environment notes
- Windows/PowerShell. Refresh PATH in commands: `$env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User")`.
- Local `next build` is slow/flaky in this environment; use `npx tsc --noEmit` for quick verification. Dev server: `npm run dev` (needs NEXTAUTH_URL, NEXTAUTH_SECRET env vars).
- Always confirm with the user before creating/deleting billable AWS resources.
