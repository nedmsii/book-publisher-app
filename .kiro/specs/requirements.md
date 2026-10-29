# Requirements Specification
## Project: Ibrahim Fawaz Araji — Book Publisher Website
**Version:** 2.1 (Serverless, no database, no admin portal)
**Date:** October 28, 2026
**Status:** Current

---

## 1. Project Summary

A bilingual (Arabic default + English), production-grade, **serverless** website for
author **Ibrahim Fawaz Araji** that showcases his 10 books, lets visitors read each
book online (embedded/linked PDF where available), and provides a contact form that
notifies the author by email. There is **no database and no admin portal**: contact
submissions are emailed only (not stored), and book/bio content is maintained in code.
The site meets current standards for SEO, AEO, AIO/GEO, and SMO.

---

## 2. Stakeholders

| Role | Name / Contact |
|---|---|
| Author / Site Owner | Ibrahim Fawaz Araji |
| Notification Email (TO) | bonahid@araji.com |
| Sending Identity (FROM) | noreply@araji.com |
| Developer | Kiro AI + Project Owner |

---

## 3. Functional Requirements

### FR-01: Home Page
- Hero with author name + tagline + CTA to books; Featured Books (up to 4);
  About blurb with link; Get-in-Touch section; site-wide header and footer.
- Bilingual: Arabic at `/`, English at `/en`, with correct RTL/LTR.

### FR-02: Books Catalog (`/books`, `/en/books`)
- All 10 books in a responsive grid; each card shows cover, title, author, genre,
  and publication year **or a "Publication date coming soon" label when the year is
  not yet confirmed**.
- Client-side search + genre filter. Cards link to the detail page.

### FR-03: Book Detail / Reader (`/books/[slug]`)
- Full metadata: title, author, cover, synopsis, genre, year (or "coming soon"),
  optional ISBN.
- **Read Online:** when a PDF exists (`contentUrl` set), provide a working
  read/download action served from `/books/<slug>.pdf`. When no PDF exists yet,
  show a disabled **"Full book coming soon"** state (no broken link).
- Breadcrumb (Home > Books > Title); related books; social share.

### FR-04: About Page
- Full bilingual biography (source: `public/images/publisher/author-bio.md`),
  milestones timeline, author portrait, CTA to contact.

### FR-05: Contact Page
- Form: Full Name (required), Email (required, validated), Subject (optional),
  Message (required, min 10 chars); honeypot anti-spam; success and error states
  that preserve input; author contact details; FAQ section.

### FR-06: Contact Form API (`POST /api/contact`)
- Validate server-side (Zod); 400 with field errors on failure.
- **Send an SES email** to `bonahid@araji.com` with the submission details.
- **No persistence.** Fail-closed: if the SES send fails, return 500 (there is no DB
  fallback), so the visitor is told to retry.
- 200 on success, 400 on validation failure, 500 on send/server error.

> **Removed in v2.1:** admin portal (FR-07), admin authentication (FR-08),
> database writes, and submission status management. New books are added by editing
> `src/data/books.ts` in code (about once a year).

---

## 4. Non-Functional Requirements

### NFR-01: SEO
Unique `<title>` (≤60) + `<meta description>` (≤160) per page; semantic HTML5;
`sitemap.xml` with all public + book pages; `robots.txt` allowing public pages and
disallowing `/api/`; descriptive `alt`; canonical URLs; Lighthouse SEO 90+.

### NFR-02: AEO
JSON-LD per page (Home: `WebSite` + `Organization`; Catalog: `CollectionPage`;
Detail: `Book`; About: `Person`; Contact: `ContactPage`); `FAQPage` on FAQ;
`BreadcrumbList` on breadcrumbs; one H1 per page with logical heading hierarchy.

### NFR-03: AIO / GEO
`/llms.txt` describing the site and key entities; About page establishes E-E-A-T;
factual, clearly attributed content.

### NFR-04: SMO
Open Graph + Twitter Card tags on every page; per-book OG image from the cover;
social share buttons pre-populate title and URL.

### NFR-05: Performance
Lighthouse Performance 85+ mobile / 90+ desktop; `next/image` with WebP + lazy load;
`next/font` (no layout shift); FCP < 2.5s.

### NFR-06: Accessibility
WCAG 2.1 AA target; full keyboard navigation; 4.5:1 min text contrast; ARIA where
needed; correct `dir`/`lang` per locale.

> Note: full WCAG conformance requires manual testing with assistive technology and
> expert review; automated checks alone are not sufficient.

### NFR-07: Security
Server-side input validation (Zod); HTTPS (Amplify/CloudFront managed, ACM cert);
no secrets in the repo (Amplify env vars + runtime role credentials for SES);
`/api/contact` is the only mutating endpoint and performs no persistence.

> **Removed in v2.1:** DB/SQL-injection surface (no DB), NextAuth admin protection
> (no admin), SSM Parameter Store, Nginx security headers (Amplify/CloudFront handles
> edge headers).

---

## 5. Constraints

| Constraint | Detail |
|---|---|
| AWS Region | us-east-1 |
| Hosting | AWS Amplify (serverless); no EC2/RDS/VPC |
| Persistence | None (email-only contact) |
| Email Provider | AWS SES (FROM noreply@araji.com, TO bonahid@araji.com) |
| Domain | ibrahimaraji.com (Route 53) |
| Book PDFs | S3 + CloudFront in prod; local `public/books/` in dev (gitignored) |
| Budget | Minimize cost; serverless + free-tier where possible |

---

## 6. Out of Scope (v2.1)

- Database / stored submissions / admin portal / authentication
- Payment / e-commerce; user accounts; DRM downloads
- CMS (content edited in code)
- Newsletter; social login; full-text search engine

---

## 7. Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-01 | All public pages load without errors in Arabic (`/`) and English (`/en`) |
| AC-02 | Contact form validates and triggers an SES email to bonahid@araji.com; a failed send returns 500 |
| AC-03 | Book detail shows a working PDF read/download when a PDF exists, and "Full book coming soon" when it does not |
| AC-04 | Books with an unconfirmed year show "Publication date coming soon"; confirmed years show the real year |
| AC-05 | Google Rich Results Test passes for Home, a Book Detail, and Contact |
| AC-06 | Lighthouse SEO score ≥ 90 on at least one page |
| AC-07 | Site reachable via the Amplify URL and (after DNS) ibrahimaraji.com |
| AC-08 | No `/admin` or auth routes exist; `robots.txt` disallows `/api/` |
| AC-09 | sitemap.xml lists all public pages including all 10 book detail pages |
| AC-10 | `npx tsc --noEmit` passes and all pages return HTTP 200 (404 only for genuinely missing routes) |
