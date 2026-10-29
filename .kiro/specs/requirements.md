# Requirements Specification
## Project: Ibrahim Fawaz Araji — Book Publisher Website
**Version:** 1.0  
**Date:** October 19, 2026  
**Status:** Approved

---

## 1. Project Summary

A multi-page, production-grade website for book publisher **Ibrahim Fawaz Araji** that showcases his 10 books, allows visitors to read books online, and provides a contact form that notifies the publisher via email and stores submissions in a database. A secure admin portal allows the publisher to review all contact submissions. The site must meet current industry standards for SEO, AEO, AIO, GEO, and SMO optimization.

---

## 2. Stakeholders

| Role | Name / Contact |
|---|---|
| Publisher / Site Owner | Ibrahim Fawaz Araji |
| Notification Email | bonahid@araji.com |
| Developer | Kiro AI + Project Owner |

---

## 3. Functional Requirements

### FR-01: Home Page
- **FR-01.1** Display a hero section with the publisher's name, a tagline, and a CTA button linking to the books page.
- **FR-01.2** Display a "Featured Books" section showing up to 4 highlighted books with cover image, title, and a "Read More" link.
- **FR-01.3** Display a brief "About the Publisher" blurb with a link to the full About page.
- **FR-01.4** Display a "Get in Touch" section with a link to the Contact page.
- **FR-01.5** Include a site-wide header with navigation links to all public pages.
- **FR-01.6** Include a site-wide footer with copyright, navigation links, and publisher contact info.

### FR-02: Books Catalog Page (`/books`)
- **FR-02.1** Display all 10 books in a responsive grid layout.
- **FR-02.2** Each book card must show: cover image, title, author, genre, and publication year.
- **FR-02.3** Each book card links to the individual Book Detail page.
- **FR-02.4** Include a filter/search bar to filter books by genre or title.

### FR-03: Book Detail / Reader Page (`/books/[slug]`)
- **FR-03.1** Display full book metadata: title, author, cover image, synopsis, genre, ISBN, publication year.
- **FR-03.2** Provide an "Read Online" section that displays a chapter listing or embedded reader.
- **FR-03.3** Include breadcrumb navigation: Home > Books > [Book Title].
- **FR-03.4** Display related books section at the bottom.
- **FR-03.5** Include social sharing buttons (Twitter/X, Facebook, LinkedIn, WhatsApp).

### FR-04: About Page (`/about`)
- **FR-04.1** Display a full biography of Ibrahim Fawaz Araji.
- **FR-04.2** Display the publisher's history, mission, and publishing philosophy.
- **FR-04.3** Display an achievements/milestones timeline section.
- **FR-04.4** Include a profile photo placeholder.
- **FR-04.5** Link to the Contact page via a CTA button.

### FR-05: Contact Page (`/contact`)
- **FR-05.1** Display a contact form with fields: Full Name (required), Email Address (required, validated), Subject (optional), Message (required, min 10 chars).
- **FR-05.2** Include a CAPTCHA or honeypot field to prevent spam.
- **FR-05.3** On successful submission, display a thank-you confirmation message.
- **FR-05.4** On error, display a user-friendly error message without losing form data.
- **FR-05.5** Display publisher contact details alongside the form: email, social media links.
- **FR-05.6** Include an FAQ section with 4–6 common questions about the publisher and his books.

### FR-06: Contact Form API (`/api/contact`)
- **FR-06.1** Accept POST requests with form data (name, email, subject, message).
- **FR-06.2** Validate all required fields server-side; return 400 with error details on failure.
- **FR-06.3** Write the validated submission to the `contact_submissions` PostgreSQL table.
- **FR-06.4** Send an email notification to `bonahid@araji.com` via AWS SES containing all submission details.
- **FR-06.5** Return 200 on success, 400 on validation failure, 500 on server error.
- **FR-06.6** Rate-limit to 5 submissions per IP per hour to prevent abuse.

### FR-07: Admin Portal (`/admin`)
- **FR-07.1** Display a paginated table of all contact form submissions (most recent first).
- **FR-07.2** Each row shows: date, name, email, subject, status (new/read/replied).
- **FR-07.3** Clicking a row expands or navigates to the full submission details.
- **FR-07.4** Allow the admin to update a submission's status (mark as read, mark as replied).
- **FR-07.5** Display a badge count of "new" (unread) submissions in the header.
- **FR-07.6** The portal must be fully protected — unauthenticated users are redirected to `/admin/login`.

### FR-08: Admin Authentication (`/admin/login`)
- **FR-08.1** Display a login form with email and password fields.
- **FR-08.2** Authenticate against the `admin_users` database table using NextAuth.js.
- **FR-08.3** Passwords must be stored as bcrypt hashes (never plaintext).
- **FR-08.4** Lock out after 5 failed attempts for 15 minutes.
- **FR-08.5** Session expires after 8 hours of inactivity.

---

## 4. Non-Functional Requirements

### NFR-01: SEO (Search Engine Optimization)
- **NFR-01.1** Every page must have a unique `<title>` tag (max 60 chars) and `<meta description>` (max 160 chars).
- **NFR-01.2** Pages must use semantic HTML5 elements (`<main>`, `<article>`, `<section>`, `<nav>`, `<header>`, `<footer>`).
- **NFR-01.3** The site must generate a `sitemap.xml` listing all public pages and book detail pages.
- **NFR-01.4** A `robots.txt` must allow all public pages and disallow `/admin`.
- **NFR-01.5** All images must have descriptive `alt` attributes.
- **NFR-01.6** Canonical URLs must be set on every page.
- **NFR-01.7** The site must achieve a Lighthouse SEO score of 90+.

### NFR-02: AEO (Answer Engine Optimization)
- **NFR-02.1** Every page must include JSON-LD structured data using Schema.org vocabulary.
  - Home: `WebSite`, `Organization`
  - Books Catalog: `CollectionPage`
  - Book Detail: `Book` (with `author`, `isbn`, `name`, `description`, `publisher`)
  - About: `Person` (with `name`, `jobTitle`, `description`)
  - Contact: `ContactPage`
- **NFR-02.2** FAQ pages must use `FAQPage` schema.
- **NFR-02.3** Breadcrumbs must use `BreadcrumbList` schema.
- **NFR-02.4** Content must be structured with clear headings (one H1 per page, logical H2/H3 hierarchy).

### NFR-03: AIO / GEO (AI & Generative Engine Optimization)
- **NFR-03.1** A `/llms.txt` file must be present describing the site, its purpose, and key entities for AI crawlers.
- **NFR-03.2** An `/about` page must clearly establish E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) signals.
- **NFR-03.3** Content must be factual, clearly attributed, and free of ambiguity.

### NFR-04: SMO (Social Media Optimization)
- **NFR-04.1** Every page must include Open Graph meta tags: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`.
- **NFR-04.2** Every page must include Twitter Card meta tags: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`.
- **NFR-04.3** Each book detail page must have a unique OG image (using book cover).
- **NFR-04.4** Social sharing buttons on book pages must pre-populate title and URL.

### NFR-05: Performance
- **NFR-05.1** Lighthouse Performance score of 85+ on mobile and 90+ on desktop.
- **NFR-05.2** Images must use Next.js `<Image>` component with WebP format and lazy loading.
- **NFR-05.3** Fonts loaded via `next/font` (no layout shift).
- **NFR-05.4** First Contentful Paint (FCP) under 2.5 seconds.

### NFR-06: Accessibility
- **NFR-06.1** WCAG 2.1 Level AA compliance.
- **NFR-06.2** All interactive elements must be keyboard navigable.
- **NFR-06.3** Color contrast ratio minimum 4.5:1 for text.
- **NFR-06.4** Screen reader compatible using ARIA labels where needed.

### NFR-07: Security
- **NFR-07.1** All form inputs must be sanitized server-side.
- **NFR-07.2** HTTPS enforced via Nginx SSL (Let's Encrypt or self-signed for EC2 IP).
- **NFR-07.3** Environment variables (DB URL, SES keys, auth secret) stored in AWS SSM Parameter Store.
- **NFR-07.4** SQL injection prevented via Prisma ORM (parameterized queries).
- **NFR-07.5** Admin routes protected by NextAuth.js middleware.
- **NFR-07.6** HTTP security headers: `X-Content-Type-Options`, `X-Frame-Options`, `Content-Security-Policy`, `Strict-Transport-Security`.

---

## 5. Constraints

| Constraint | Detail |
|---|---|
| AWS Region | us-east-1 |
| EC2 Domain | AWS-generated public DNS (no custom domain initially) |
| EC2 Size | t3.small (can be upgraded later) |
| RDS Size | db.t3.micro PostgreSQL 15+ |
| Book Content | Placeholder data initially; real covers/content added later |
| Email Provider | AWS SES only |
| Budget | Minimize cost; use free-tier eligible resources where possible |

---

## 6. Out of Scope (v1.0)

- Payment / e-commerce functionality
- User accounts / reader profiles
- Book purchase or download (DRM)
- Custom domain / SSL certificate (until domain is registered)
- Multi-language / i18n support
- Social login (Google, Facebook)
- Newsletter / mailing list integration
- Book search with full-text search engine (Elasticsearch)

---

## 7. Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-01 | All 6 pages load without errors on a browser |
| AC-02 | Contact form submits data to PostgreSQL and triggers SES email to bonahid@araji.com |
| AC-03 | Admin can log in at /admin/login and view all submissions |
| AC-04 | Admin can mark submissions as read/replied |
| AC-05 | Google Rich Results Test passes for at least Home, Book Detail, and Contact pages |
| AC-06 | Lighthouse SEO score ≥ 90 on at least one page |
| AC-07 | Site is reachable via EC2 public DNS URL |
| AC-08 | /admin is inaccessible to unauthenticated users |
| AC-09 | robots.txt disallows /admin and allows all public pages |
| AC-10 | sitemap.xml lists all public pages including all 10 book detail pages |
