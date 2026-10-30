# Implementation Tasks
## Project: Ibrahim Fawaz Araji — Book Publisher Website
**Version:** 2.1 (Serverless, no database, no admin portal)
**Date:** October 29, 2026
**Status:** LIVE in production at https://ibrahimaraji.com — remaining items are owner content + optional audits

---

## How to Use This File

`[x]` complete, `[~]` in progress, `[ ]` not started, `[!]` blocked (waiting on owner).
See `.kiro/steering/progress.md` for the session handoff and production cheat-sheet.

---

## Phase 1 — App Foundation
- [x] **T-01** Next.js 14.2.21 + TypeScript + Tailwind scaffold
- [x] **T-02** Bilingual i18n: Arabic default at `/`, English at `/en`, RTL, hreflang, localized metadata/JSON-LD
- [x] **T-03** Root `src/app/layout.tsx` (pass-through) + `[lang]/layout.tsx` (html/body shell)
- [x] **T-04** Shared components: Header, Footer, Breadcrumb
- [x] **T-05** Shared types + static book data (`src/data/books.ts`)

## Phase 2 — Public Pages
- [x] **T-06** Home (hero, featured, about blurb, contact CTA) + JSON-LD
- [x] **T-07** Books catalog with client-side search + genre filter
- [x] **T-08** Book detail (cover, metadata, synopsis, related, share) + PDF read/download
- [x] **T-09** About page (bilingual bio, milestones, portrait)
- [x] **T-10** Contact page (form + FAQ + details)
- [x] **T-11** 404 / error boundaries (top-level + localized)

## Phase 3 — Contact API + Email (no DB)
- [x] **T-12** `POST /api/contact`: Zod + honeypot + SES email only, fail-closed (500 on send failure)
- [x] **T-13** SES utility (`src/lib/ses.ts`), FROM noreply@araji.com, TO bonahid@araji.com
- [x] **T-14** Zod schema (`src/lib/validations.ts`)

## Phase 4 — SEO / AEO / SMO / AIO
- [x] **T-15** JSON-LD helpers (`src/lib/structured-data.ts`)
- [x] **T-16** `sitemap.ts` + `robots.ts` (disallow `/api/`)
- [x] **T-17** `public/llms.txt`
- [x] **T-18a** Social share (Open Graph) card `public/og/og-default.jpg` (1200x630) + Twitter card; verified live
- [x] **T-18b** Favicons: `favicon.ico`, `icon.png` (512), `apple-icon.png` (180); verified live

## Phase 5 — v2.1 Teardown
- [x] **T-19** Remove Prisma + DB usage
- [x] **T-20** Remove admin portal and NextAuth/auth
- [x] **T-21** Remove legacy EC2/RDS/VPC infra scripts
- [x] **T-22** Rename `NEXTAUTH_URL` → `SITE_URL`; clean `package.json` + `.env` examples
- [x] **T-23** Fix runtime bugs tsc missed: RSC dict serialization, missing root layout, middleware asset exclusions

## Phase 6 — Content
- [x] **T-24** 10 real covers wired to `books.ts`
- [x] **T-25** Canonical bilingual bio (`public/images/publisher/author-bio.md`); birthplace Bar Elias / برالياس
- [x] **T-26** 5 book PDFs wired (`/books/<slug>.pdf`); "coming soon" for the other 5
- [x] **T-27** "Coming soon" placeholders for unconfirmed publication years
- [x] **T-27a** Hero banner: fanned stack of the 3 newest real book covers (newest in front)
- [x] **T-27b** About page portrait replaced with `Ibrahim_Araji_2.jpeg` (both languages)
- [!] **T-28** Remaining 5 book PDFs — **waiting on owner**
- [!] **T-29** Real publication dates + official summaries for 8 books — **waiting on owner**

## Phase 7 — AWS + Deploy
- [x] **T-30** Verify AWS creds, SES, Route 53 zone
- [x] **T-31** SES production access — **decided NOT needed** (sandbox is sufficient: form only sends to the verified owner address)
- [x] **T-32** Repo pushed to GitHub `nedmsii/book-publisher-app`
- [x] **T-33** PDFs in private S3 bucket `ibrahimaraji-book-pdfs`, served via CloudFront + OAC and an Amplify rewrite
- [x] **T-34** Amplify app `d1ek00pa1xp96o` with env vars SITE_URL, SES_FROM_EMAIL, ADMIN_NOTIFICATION_EMAIL (no `AWS_*` vars — reserved prefix)
- [x] **T-34a** Amplify compute role set + SES send policy (identities + configuration set) so the contact form can send
- [x] **T-35** Custom domain ibrahimaraji.com + www (ACM via Amplify)
- [x] **T-36** Post-deploy verification: all pages 200 in both languages, PDFs 200, contact email received

## Phase 8 — Final Verification
- [x] **T-37** End-to-end contact form test against live SES (EN + AR, owner confirmed)
- [x] **T-38** `robots.txt` disallows `/api/`; no `/admin` routes exist
- [ ] **T-39** Google Rich Results Test (Home, a Book Detail, Contact) — optional
- [ ] **T-40** Lighthouse audit (SEO 90+, Accessibility 90+) — optional

## Phase 9 — Housekeeping (owner / optional)
- [ ] **T-41** Revoke the GitHub personal access token used for pushes (github.com/settings/tokens) — **owner action, security**
- [ ] **T-42** Bump Node 20 → 22 (Amplify build image + local) before ~Jan 2027 (AWS SDK requirement)
- [ ] **T-43** Optional: disable SES VDM to trim cost; tighter head-shot crop for the 16px tab favicon

---

## Summary

| Phase | Scope | Status |
|---|---|---|
| 1 — Foundation | scaffold, i18n, layouts | done |
| 2 — Pages | home, catalog, detail, about, contact, errors | done |
| 3 — Contact API | SES-only, no DB | done |
| 4 — SEO/SMO | JSON-LD, sitemap, robots, OG card, favicons | done |
| 5 — Teardown | remove DB/admin/infra; runtime fixes | done |
| 6 — Content | covers, bio, PDFs, hero, portrait | done except owner content (T-28, T-29) |
| 7 — Deploy | GitHub, Amplify, S3/CloudFront, SES, domain | done |
| 8 — Verify | E2E done; Rich Results + Lighthouse optional | mostly done |
| 9 — Housekeeping | token revoke, Node 22, optional polish | open |
