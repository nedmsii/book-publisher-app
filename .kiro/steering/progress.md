---
inclusion: always
---

# Project Handoff (read first in any new session)

Last updated: Oct 29, 2026. **Status: LIVE and fully working** at https://ibrahimaraji.com (+ www).
Specs: `.kiro/specs/{requirements,design,tasks}.md` (v2.1). Deploy guide: `DEPLOY.md`.

## What it is
Bilingual (Arabic default at `/`, English at `/en`) Next.js 14.2.21 App Router site for author
Ibrahim Fawaz Araji (Arabic: إبراهيم فواز عراجي — NOT عرجي). Serverless on AWS Amplify.
No database, no admin portal, no CMS. Content lives in code: `src/data/books.ts`,
`src/i18n/dictionaries/{ar,en}.ts`. Contact form = SES email only (no storage).

## Production facts
- Repo: github.com/nedmsii/book-publisher-app, branch `main`. Push to main = auto-deploy.
- Amplify app `d1ek00pa1xp96o` (WEB_COMPUTE). Logs: CloudWatch `/aws/amplify/d1ek00pa1xp96o`.
  Manual redeploy: `aws amplify start-job --app-id d1ek00pa1xp96o --branch-name main --job-type RELEASE`.
- Env vars (Amplify): `SITE_URL`, `SES_FROM_EMAIL=noreply@araji.com`, `ADMIN_NOTIFICATION_EMAIL=bonahid@araji.com`.
- Compute role `AmplifySSRLoggingRole-7b42fcda-305a-4a0b-9045-7aaefb814062` is set as `computeRoleArn`;
  inline policy `AmplifyContactFormSesSend` (documented in `ses-policy.json`) allows ses:SendEmail/SendRawEmail
  on identity/araji.com, identity/bonahid@araji.com, configuration-set/*.
- SES: sandbox (enough — form only sends to the verified owner). Account 445476945051, us-east-1.
- PDFs: private S3 `ibrahimaraji-book-pdfs/books/<slug>.pdf` → CloudFront `d359854tktotd7.cloudfront.net`
  (dist E1O6N1TD3WGDVJ, OAC E3VDLA9421C496). Locally in `public/books/` (gitignored).
- Amplify rewrites (order matters):
  `[{"/books/<*>.pdf" → "https://d359854tktotd7.cloudfront.net/books/<*>.pdf", 200}, {"/<*>" → "/index.html", 404-200}]`
- Route 53 zone Z0257072R4RE5ZV3UL36; ACM cert managed by Amplify.

## Gotchas (each one broke production once)
1. Never add an Amplify env var starting with `AWS` (reserved) — build fails.
2. AWS SDK calls from SSR need the compute role. The policy must cover every SES resource
   (identities AND the configuration set `my-first-configuration-set`).
3. The `/books` rewrite must stay `.pdf`-only, or it swallows Arabic book pages (`/books/<slug>`).
4. Middleware `isExcludedPath` must skip static assets: `/images/`, `/og/`, `/books/*.pdf`,
   `/favicon.ico`, `/icon.png`, `/apple-icon.png`. Any new top-level public asset must be added there.
5. i18n dictionaries must stay JSON-serializable (no functions; use `{token}` + `.replace()`).
6. `src/app/layout.tsx` (pass-through root layout) must exist.
7. `tsc` passing is not enough — always load pages / run `npm run build` to catch runtime errors.

## Environment notes (Windows/PowerShell)
- Terminal echoes commands noisily: redirect output to a `.log`, read the file, delete it after.
- Stop the dev server before `npm run build` (it locks `.next\trace` → EPERM). Orphaned node
  processes can hold ports 3000–3002: `Get-Process node | Stop-Process -Force`.
- AWS CLI: `"C:\Program Files\Amazon\AWSCLIV2\aws.exe"`, add `--cli-read-timeout 25 --no-cli-pager`.
  S3 CLI uploads of large files can time out; the S3 console is more reliable.
- Git pushes: the credential popup hangs here. Pushes used a PAT inline in the URL with
  `GIT_TERMINAL_PROMPT=0`. That PAT must be REVOKED (owner); next push needs a fresh PAT or `gh` login.

## How to add content
- New PDF: upload to `s3://ibrahimaraji-book-pdfs/books/<slug>.pdf`, set `contentUrl: "/books/<slug>.pdf"`
  in `books.ts`, push.
- Publish year: set `publishedYear` in `books.ts` (0 shows "Publication date coming soon").
- New book: add to `books.ts` with the next `sortOrder` (higher = newer). Hero shows the 3 newest automatically.
- Regenerate images: `scripts/make-og-image.ps1` (share card), `scripts/make-favicons.ps1`.

## Recent changes (Oct 29)
- Share card + favicons, hero fanned book covers, About portrait now `Ibrahim_Araji_2.jpeg`.

## Open items
- Owner content: remaining 5 PDFs (quran-and-modern-sciences, the-road-to-god, islamic-masterpieces,
  history-of-the-araji-family, scientific-miracles-quran-sunnah) + real dates/summaries for 8 books.
- Owner security: revoke the GitHub PAT.
- Before ~Jan 2027: bump Node 20 → 22 (Amplify + local).
- Optional: Rich Results + Lighthouse audits, disable SES VDM, tighter tab favicon crop.
