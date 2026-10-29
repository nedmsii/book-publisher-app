# Implementation Tasks
## Project: Ibrahim Fawaz Araji — Book Publisher Website
**Version:** 2.1 (Serverless, no database, no admin portal)
**Date:** October 28, 2026
**Status:** In progress

---

## How to Use This File

Tasks are grouped into phases. `[x]` complete, `[~]` in progress, `[ ]` not started,
`[!]` blocked (waiting on owner). See `.kiro/steering/progress.md` for the live
session handoff notes.

---

## Phase 1 — App Foundation
- [x] **T-01** Next.js 14.2.21 + TypeScript + Tailwind scaffold; `npx tsc --noEmit` passes
- [x] **T-02** Bilingual i18n: Arabic default at `/`, English at `/en`, RTL, Noto Kufi
  Arabic font, hreflang, localized metadata/JSON-LD (`src/app/[lang]/` + `middleware.ts`)
- [x] **T-03** Root `src/app/layout.tsx` (pass-through) + `[lang]/layout.tsx` (html/body shell)
- [x] **T-04** Shared components: Header, Footer, Breadcrumb
- [x] **T-05** Shared types (`src/types/index.ts`) and static book data (`src/data/books.ts`)

## Phase 2 — Public Pages
- [x] **T-06** Home (hero, featured, about blurb, contact CTA) + JSON-LD
- [x] **T-07** Books catalog with client-side search + genre filter
- [x] **T-08** Book detail (cover, metadata, synopsis, related, share) + PDF read/download
- [x] **T-09** About page (bilingual bio, milestones, portrait)
- [x] **T-10** Contact page (form + FAQ + details)
- [x] **T-11** 404 / error boundaries (top-level + localized)

## Phase 3 — Contact API + Email (no DB)
- [x] **T-12** `POST /api/contact`: Zod validation + honeypot + **SES email only**,
  fail-closed (500 on send failure), no persistence
- [x] **T-13** SES utility (`src/lib/ses.ts`), FROM noreply@araji.com, TO bonahid@araji.com
- [x] **T-14** Zod schema (`src/lib/validations.ts`: `contactFormSchema`)

## Phase 4 — SEO / AEO / SMO / AIO
- [x] **T-15** JSON-LD helpers (`src/lib/structured-data.ts`)
- [x] **T-16** `sitemap.ts` (all routes + 10 slugs), `robots.ts` (disallow `/api/`)
- [x] **T-17** `public/llms.txt`
- [ ] **T-18** Final metadata audit + Google Rich Results + Lighthouse (do after deploy)

## Phase 5 — v2.1 Teardown (done Oct 28)
- [x] **T-19** Remove Prisma (schema, seed, client) + DB usage
- [x] **T-20** Remove admin portal (UI + API) and NextAuth/auth
- [x] **T-21** Remove legacy EC2/RDS/VPC infra scripts (`infrastructure/`)
- [x] **T-22** Rename `NEXTAUTH_URL` → `SITE_URL`; clean `package.json` + `.env` examples
- [x] **T-23** Fix runtime bugs found by loading pages (not caught by tsc):
  RSC dict serialization, `/books/` middleware exclusion, missing root layout

## Phase 6 — Content
- [x] **T-24** 10 real covers (slug-named) wired to `books.ts`
- [x] **T-25** Canonical bilingual bio (`public/images/publisher/author-bio.md`);
  About text synced; birthplace corrected to Bar Elias / برالياس
- [x] **T-26** Wire the 5 provided book PDFs (`/books/<slug>.pdf`); "coming soon" for the other 5
- [x] **T-27** "Coming soon" placeholders for unconfirmed publication years
- [!] **T-28** Remaining 5 book PDFs — **waiting on owner**
- [!] **T-29** Real publication dates + official summaries for the other 8 books — **waiting on owner**

## Phase 7 — AWS + Deploy
- [x] **T-30** Verify AWS creds; SES (sandbox, no dedicated IPs); Route 53 zone for ibrahimaraji.com
- [ ] **T-31** Request SES production access in console — **owner action**
- [ ] **T-32** Push repo to GitHub (owner creates free account) for Amplify to connect
- [ ] **T-33** Upload book PDFs to S3; serve `/books/*.pdf` via CloudFront
- [ ] **T-34** Create Amplify app, set env vars (SITE_URL, AWS_REGION, SES_FROM_EMAIL, ADMIN_NOTIFICATION_EMAIL)
- [ ] **T-35** Connect custom domain ibrahimaraji.com (ACM via Amplify)
- [ ] **T-36** Post-deploy verification: pages 200, contact email received, Lighthouse/Rich Results

## Phase 8 — Final Verification
- [ ] **T-37** End-to-end contact form test against live SES
- [ ] **T-38** Confirm `robots.txt` disallows `/api/`, no `/admin` exists
- [ ] **T-39** Google Rich Results Test (Home, a Book Detail, Contact)
- [ ] **T-40** Lighthouse audit (SEO 90+, Accessibility 90+)

---

## Summary

| Phase | Scope | Status |
|---|---|---|
| 1 — Foundation | scaffold, i18n, layouts, types/data | done |
| 2 — Pages | home, catalog, detail, about, contact, errors | done |
| 3 — Contact API | SES-only, no DB | done |
| 4 — SEO/AEO/SMO/AIO | JSON-LD, sitemap, robots, llms.txt | mostly done (audit after deploy) |
| 5 — Teardown | remove DB/admin/infra; fix runtime bugs | done |
| 6 — Content | covers, bio, PDFs, placeholders | partial (waiting on owner for rest) |
| 7 — AWS + Deploy | SES prod, GitHub, S3 PDFs, Amplify, domain | not started |
| 8 — Verify | E2E + audits | not started |
