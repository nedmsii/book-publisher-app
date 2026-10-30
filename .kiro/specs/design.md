# Technical Design Specification
## Project: Ibrahim Fawaz Araji — Book Publisher Website
**Version:** 2.1 (Serverless, no database, no admin portal)
**Date:** October 28, 2026
**Status:** Current

> **v2.1 Architecture Change (supersedes v2.0):** The project dropped the database
> and the admin portal entirely. Rationale (owner decision): contact volume is very
> low and email notification alone is sufficient, and new books are added about once
> a year by editing code — so no CMS, no admin UI, and no persistence are needed.
>
> Changes from v2.0:
> - **Removed:** DynamoDB (no contact persistence), the admin portal + NextAuth/auth,
>   and all legacy EC2/RDS/VPC/Prisma/Nginx/PM2 artifacts.
> - **Contact form:** validates input and sends an SES email only. Fail-closed — if the
>   email send fails there is no DB fallback, so the API returns HTTP 500 and the
>   visitor is asked to retry.
> - **Books / content:** fully static, defined in `src/data/books.ts` and the i18n
>   dictionaries. Book PDFs are served from `/books/*.pdf` (local `public/books/` in dev;
>   S3 + CloudFront in production).
> - **i18n:** Bilingual Arabic (default, at `/`) + English (at `/en`) with RTL — unchanged.

---

## 1. Architecture Overview (v2.1 — Serverless, no DB)

```
┌──────────────────────────────────────────────────────────┐
│                         CLIENT                             │
│        Browser (Arabic RTL default / English LTR)          │
└────────────────────────────┬───────────────────────────────┘
                             │ HTTPS
┌────────────────────────────▼───────────────────────────────┐
│                  AWS Amplify Hosting (us-east-1)             │
│   CloudFront CDN  →  S3 (static)  +  Lambda (SSR + API)      │
│   ┌────────────────────────────────────────────────────┐   │
│   │  Next.js 14 App (App Router)                        │   │
│   │   - Static pages (books, about) via CloudFront       │   │
│   │   - SSR pages + metadata via Lambda                  │   │
│   │   - Single API route: POST /api/contact (Lambda)     │   │
│   │   - NO database client, NO auth                      │   │
│   └───────────────────────────────┬────────────────────┘   │
└───────────────────────────────────┼─────────────────────────┘
                                    │
                          ┌─────────▼───────────┐
                          │       AWS SES        │
                          │ Email notifications  │
                          │ FROM noreply@araji.com│
                          │ TO   bonahid@araji.com│
                          └─────────────────────┘

Book PDFs: S3 bucket → served via CloudFront at /books/*.pdf
Domain: ibrahimaraji.com (Route 53 hosted zone; ACM cert via Amplify)
```

No DynamoDB, no RDS, no EC2, no VPC, no SSM (env vars configured in Amplify), no admin.

---

## 2. Technology Stack (v2.1)

| Layer | Technology | Notes |
|---|---|---|
| Runtime | Node.js | 20 LTS |
| Framework | Next.js | 14.2.21 (App Router) |
| Language | TypeScript | 5.x (strict) |
| Styling | Tailwind CSS | 3.x |
| i18n | Custom dictionary + RTL | Arabic (default `/`) + English (`/en`) |
| Database | **none** | Contact form is email-only; no persistence |
| Auth | **none** | Admin portal removed |
| Email | AWS SES SDK | `@aws-sdk/client-ses` v3 |
| Validation | Zod | 3.x |
| Hosting | **AWS Amplify** | S3 + CloudFront + Lambda (serverless) |
| Book PDFs | S3 + CloudFront | Served at `/books/*.pdf` |
| DNS | Route 53 | `ibrahimaraji.com` (zone Z0257072R4RE5ZV3UL36) |

> **Removed from earlier versions:** PostgreSQL, Prisma, RDS, DynamoDB, NextAuth,
> bcryptjs, EC2, Nginx, PM2, VPC, subnets, security groups, SSM Parameter Store.

---

## 3. Project Structure (current)

```
book-publisher-app/
├── .kiro/
│   ├── specs/{requirements,design,tasks}.md
│   └── steering/{progress,project-standards}.md
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout — pass-through (returns children)
│   │   ├── not-found.tsx             # Top-level 404 (renders own html/body)
│   │   ├── global-error.tsx          # Top-level 500 (renders own html/body)
│   │   ├── robots.ts                 # robots.txt (uses SITE_URL)
│   │   ├── sitemap.ts                # sitemap.xml (uses SITE_URL)
│   │   ├── fonts.ts                  # next/font setup (Noto Kufi Arabic + body)
│   │   ├── globals.css
│   │   ├── [lang]/                   # Locale segment: ar (default) | en
│   │   │   ├── layout.tsx            # Renders <html lang dir> + Header/Footer
│   │   │   ├── page.tsx              # Home
│   │   │   ├── not-found.tsx         # Localized 404
│   │   │   ├── error.tsx             # Localized error boundary
│   │   │   ├── books/page.tsx        # Catalog
│   │   │   ├── books/[slug]/page.tsx # Book detail (+ PDF read/download)
│   │   │   ├── about/page.tsx        # About / bio
│   │   │   └── contact/page.tsx      # Contact form
│   │   └── api/
│   │       └── contact/route.ts      # POST /api/contact — Zod + honeypot + SES only
│   │
│   ├── components/
│   │   ├── layout/{Header,Footer,Breadcrumb}.tsx
│   │   ├── home/{HeroSection,FeaturedBooks,AboutBlurb}.tsx
│   │   ├── books/{BookCard,BookGrid,SocialShare}.tsx
│   │   └── contact/{ContactForm,FAQSection}.tsx
│   │
│   ├── lib/
│   │   ├── ses.ts                    # AWS SES email utility
│   │   ├── validations.ts            # Zod: contactFormSchema
│   │   └── structured-data.ts        # JSON-LD helpers (uses SITE_URL)
│   │
│   ├── data/books.ts                 # 10 books (static)
│   ├── i18n/                         # config, dictionaries (ar.ts/en.ts), metadata, types
│   ├── types/index.ts               # Book, Chapter, LocalizedString, FAQ, etc.
│   └── middleware.ts                # Locale rewrite (/ → /ar), asset-path exclusions
│
├── public/
│   ├── images/books/                 # 10 real covers (slug-named)
│   ├── images/publisher/             # author portrait + author-bio.md (canonical bio)
│   ├── books/                        # Book PDFs (local dev; gitignored; S3 in prod)
│   └── llms.txt
│
├── .env.example / .env.local.example
├── next.config.mjs, tailwind.config.ts, tsconfig.json, package.json
```

> **Note:** there is no `prisma/`, no `infrastructure/`, no `src/app/admin/`,
> no `src/app/api/auth/`, no `src/lib/{prisma,auth}.ts`. Those were removed in v2.1.

### Critical invariants (learned from runtime bugs)
1. **Root layout required.** `src/app/layout.tsx` must exist (App Router requirement).
   It is a pass-through so the `[lang]` layout and the 404/500 boundaries own their
   own `<html>/<body>`. Deleting it causes 500s on unmatched routes.
2. **Dictionaries must be JSON-serializable.** The i18n dictionaries are passed from
   Server Components into Client Components, so they must contain **no function values**
   (use `"...{token}..."` string templates + `.replace()` at call sites, not arrow fns).
3. **Static asset dirs must be excluded in middleware.** Any top-level `public/` dir
   served directly (e.g. `/images/`, `/books/`, `/og/`) must be listed in
   `isExcludedPath()` in `src/middleware.ts`, or the locale rewrite turns it into
   `/ar/...` and it 404s.

---

## 4. Data Model (no database)

Books are a static TypeScript array (`src/data/books.ts`) of the `Book` type
(`src/types/index.ts`). Key fields: `id`, `slug`, bilingual `title`/`synopsis`,
`coverImage`, `publishedYear` (0 ⇒ "coming soon" label), `genre` + bilingual
`genreLabel`, optional `contentUrl` (PDF path; absent ⇒ "coming soon"), `featured`,
`sortOrder` (true publication order, displayed newest-first).

Contact submissions are **not stored**. They are emailed and then discarded.

---

## 5. API Endpoints

### POST `/api/contact`
Submit a contact form.

**Request Body:**
```json
{
  "name": "string (required, 2-100 chars)",
  "email": "string (required, valid email)",
  "subject": "string (optional, max 200 chars)",
  "message": "string (required, 10-2000 chars)",
  "honeypot": "string (must be empty — spam trap)"
}
```

**Success (200):** `{ "success": true, "message": "..." }`
**Validation error (400):** `{ "success": false, "errors": { "email": "..." } }`
**Server error (500):** `{ "success": false, "message": "..." }` — returned when the
SES send fails (fail-closed; there is no DB fallback).

**Side effect:** sends one SES email to `bonahid@araji.com`. No persistence.

> There is no `/api/admin/*` and no `/api/auth/*` in v2.1.

---

## 6. Email Notification (AWS SES)

`src/lib/ses.ts` sends an HTML + plain-text email on each submission.

- **From:** `noreply@araji.com` (env `SES_FROM_EMAIL`)
- **To:** `bonahid@araji.com` (env `ADMIN_NOTIFICATION_EMAIL`)
- **Subject:** `New Contact Form Submission — [Subject or "No Subject"]`
- Body contains name, email, subject, date, and the message. (No "log in to admin" line.)
- SES is in **sandbox** until production access is requested; in sandbox it can only
  deliver to verified identities (`bonahid@araji.com` is verified).

---

## 7. SEO / AEO / SMO / AIO

Unchanged in intent from earlier versions and implemented via per-page
`generateMetadata()`, JSON-LD helpers in `src/lib/structured-data.ts`
(`websiteSchema`, `organizationSchema`, `bookSchema`, `personSchema`,
`contactPageSchema`, `faqSchema`, `breadcrumbSchema`, `collectionPageSchema`),
`sitemap.ts`, `robots.ts`, and `public/llms.txt`. Base URL comes from the
`SITE_URL` env var. `robots.ts` disallows `/api/` only (no `/admin` anymore).

---

## 8. Environment Variables (v2.1)

Configured in Amplify (and `.env.local` for dev):

```bash
SITE_URL="https://ibrahimaraji.com"      # base URL for canonical/sitemap/robots/JSON-LD
SES_FROM_EMAIL="noreply@araji.com"
ADMIN_NOTIFICATION_EMAIL="bonahid@araji.com"
```

> **Amplify note:** do NOT set `AWS_REGION` in Amplify — it rejects variables starting
> with the reserved `AWS` prefix. Lambda provides `AWS_REGION` at runtime; `ses.ts`
> also falls back to `"us-east-1"`. (`.env.local` for local dev may still set it.)

> Removed: `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `AWS_ACCESS_KEY_ID`,
> `AWS_SECRET_ACCESS_KEY` (Amplify provides role credentials at runtime). `NEXTAUTH_URL`
> was renamed to `SITE_URL` since it was only ever the site base URL, never auth.

---

## 9. Deployment (AWS Amplify) — as deployed Oct 29, 2026

1. Repo on GitHub (`nedmsii/book-publisher-app`); Amplify app `d1ek00pa1xp96o` builds `main`
   automatically on push using `amplify.yml`.
2. Env vars from §8 set in the Amplify console (no `AWS_*` names).
3. **Compute role:** the app's `computeRoleArn` is set to the Amplify SSR role, which carries an
   inline policy allowing `ses:SendEmail`/`ses:SendRawEmail` on the two verified identities and on
   `configuration-set/*`. Without a compute role the SSR function has no AWS credentials at all.
4. **PDFs:** private S3 bucket `ibrahimaraji-book-pdfs` → CloudFront with Origin Access Control.
   An Amplify rewrite forwards `/books/<*>.pdf` to CloudFront. It must stay `.pdf`-only so Arabic
   book pages (`/books/<slug>`) still reach the app.
5. **Domain:** `ibrahimaraji.com` + `www` via Route 53; ACM certificate managed by Amplify.
6. **SES:** stays in sandbox by design. The form only sends to the verified owner address, so
   production access isn't needed unless we add auto-replies to visitors.

## 10. Branding & social sharing

- Open Graph / Twitter card: `public/og/og-default.jpg` (1200×630), set in `[lang]/layout.tsx`.
  The card image is English-only (System.Drawing can't shape Arabic); title/description are localized.
- Book pages use their cover as the OG image.
- Favicons: `public/favicon.ico`, `public/icon.png` (512), `public/apple-icon.png` (180).
- Hero shows the three newest covers (`getBooksForDisplay().slice(0, 3)`), newest in front.
- About portrait: `public/images/publisher/Ibrahim_Araji_2.jpeg`.
- Generators: `scripts/make-og-image.ps1`, `scripts/make-favicons.ps1`.
