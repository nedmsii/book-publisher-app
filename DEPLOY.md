# Deployment Guide — AWS Amplify (v2.1)

Serverless Next.js 14 (App Router) app. No database, no admin. Contact form sends
email via AWS SES only. See `.kiro/specs/design.md` for the full architecture.

## Prerequisites (owner actions)
- **GitHub account:** `nedmsii` (ned@themarketingscience.com). The repo must be pushed
  to GitHub so Amplify can connect to it.
- **AWS account:** 445476945051 (us-east-1), AWS CLI v2 configured.
- **SES:** sandbox is sufficient — the form sends FROM noreply@araji.com (verified
  domain araji.com) TO bonahid@araji.com (verified). No production access needed.
- **Route 53:** `ibrahimaraji.com` hosted zone exists (Z0257072R4RE5ZV3UL36).

## 1. Push the repo to GitHub
Create an empty repo on GitHub (e.g. `nedmsii/book-publisher-app`), then from the
project root:
```
git remote add origin https://github.com/nedmsii/book-publisher-app.git
git push -u origin main
```
(The book PDFs under `public/books/` are gitignored and will NOT be pushed — they go
to S3 in step 3.)

## 2. Create the Amplify app
- Amplify console → New app → Host web app → GitHub → authorize → pick the repo/branch (`main`).
- Amplify auto-detects Next.js SSR and uses the committed `amplify.yml`.
- **Build settings:** Node 20 (matches local). NOTE: the AWS SDK warns that releases
  after early Jan 2027 will require Node ≥22 — plan to bump the Amplify build image to
  Node 22 around then (and locally).
- **Environment variables** (Amplify → App settings → Environment variables):
  ```
  SITE_URL=https://ibrahimaraji.com
  SES_FROM_EMAIL=noreply@araji.com
  ADMIN_NOTIFICATION_EMAIL=bonahid@araji.com
  ```
  > Do NOT set `AWS_REGION` — Amplify rejects any variable starting with `AWS`
  > (reserved prefix). The Lambda runtime provides `AWS_REGION` automatically, and
  > `ses.ts` falls back to `"us-east-1"` regardless.
- **SES permissions:** the Amplify SSR compute role needs `ses:SendEmail`. Attach a
  policy allowing `ses:SendEmail` / `ses:SendRawEmail` (optionally scoped to the
  verified identities) to the app's compute/execution role.

## 3. Book PDFs → S3 + CloudFront
The 5 current PDFs are in `public/books/` locally (gitignored). For production:
```
pwsh ./scripts/upload-book-pdfs.ps1 -Bucket <your-pdf-bucket>
```
Then serve `/books/*` from that bucket via CloudFront. Two options:
- **Amplify rewrite/redirect:** add a rewrite rule `/books/<*>` → the CloudFront/S3 URL.
- **Dedicated CloudFront distribution** with the S3 bucket as origin, path `/books/*`.
Either way the app keeps referencing `/books/<slug>.pdf` unchanged. Remaining 5 PDFs
can be uploaded the same way when provided.

## 4. Custom domain
- Amplify → Domain management → add `ibrahimaraji.com` (and `www`).
- Amplify provisions an ACM cert and adds the records to the Route 53 zone automatically.

## 5. Post-deploy verification
- All pages load (Arabic `/`, English `/en`), book detail PDFs open for the 5 wired books.
- Submit the contact form → confirm an email arrives at bonahid@araji.com.
- Google Rich Results Test (Home, a Book Detail, Contact) and a Lighthouse pass (SEO/Accessibility 90+).
