# Implementation Plan
## Project: Ibrahim Fawaz Araji — Book Publisher Website
**Generated:** October 19, 2026  
**Source specs:** `.kiro/specs/requirements.md`, `.kiro/specs/design.md`, `.kiro/specs/tasks.md`

---

## Important Notes for the Implementer

- **Workspace root:** `c:\Users\naraji\Documents\AWS\Spec-Driven Development with Kiro\Kiro_Projects\book-publisher-app`
- **Scaffold note:** The `book-publisher-app` directory already exists (it contains `.kiro/`). Run `create-next-app` from the **parent** directory (`c:\Users\naraji\Documents\AWS\Spec-Driven Development with Kiro\Kiro_Projects`) and target `book-publisher-app` as the project name. Pass `--no-git` to skip git init. When the CLI prompts `"The directory book-publisher-app already exists — continue?"`, answer **Y**.
- **Phase 8 scripts** are written to disk in `infrastructure/` but NOT executed by the coder. The user runs them manually against their AWS account.
- **Phase 10** items produce text documents (checklists/notes), not runnable tests.
- Each phase must leave the codebase in a buildable state before moving to the next phase.

---

## Phase 1 — Project Scaffold (TASK-01 to TASK-05)

- [ ] 1. **TASK-01 — Initialize Next.js 14 project**

  Run `create-next-app` from the parent directory, targeting the existing `book-publisher-app` folder. Answer **Y** when prompted about the existing directory.

  ```
  cd "c:\Users\naraji\Documents\AWS\Spec-Driven Development with Kiro\Kiro_Projects"
  npx create-next-app@latest book-publisher-app --typescript --tailwind --eslint --app --src-dir --no-git
  ```

  When prompted:
  - Use the existing directory? → **Y**
  - Import alias default (`@/*`) → accept default

  Files created by scaffold (do not overwrite `.kiro/`):  
  `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `.gitignore`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

  Also create `.env.example` with this content:
  ```
  DATABASE_URL="postgresql://user:password@localhost:5432/bookpublisher"
  NEXTAUTH_URL="http://localhost:3000"
  NEXTAUTH_SECRET="replace-me-with-32-char-secret"
  AWS_REGION="us-east-1"
  SES_FROM_EMAIL="bonahid@araji.com"
  ADMIN_NOTIFICATION_EMAIL="bonahid@araji.com"
  ```

  Also create `.env.local` (for local dev only, already in `.gitignore`):
  ```
  DATABASE_URL="postgresql://user:password@localhost:5432/bookpublisher"
  NEXTAUTH_URL="http://localhost:3000"
  NEXTAUTH_SECRET="dev-secret-32-chars-minimum-here"
  AWS_REGION="us-east-1"
  SES_FROM_EMAIL="bonahid@araji.com"
  ADMIN_NOTIFICATION_EMAIL="bonahid@araji.com"
  ```

  **Verify:** `npm run dev` starts at `http://localhost:3000` without errors.

---

- [ ] 2. **TASK-02 — Install and configure all dependencies**

  Run from `book-publisher-app/`:
  ```
  npm install prisma @prisma/client
  npm install next-auth@beta
  npm install @auth/prisma-adapter
  npm install @aws-sdk/client-ses
  npm install zod
  npm install bcryptjs
  npm install --save-dev @types/bcryptjs
  ```

  Initialize Prisma (creates `prisma/schema.prisma` and `prisma/.gitignore`):
  ```
  npx prisma init --datasource-provider postgresql
  ```

  Initialize shadcn/ui:
  ```
  npx shadcn@latest init
  ```
  When prompted: style → Default, base color → Slate, CSS variables → Yes.

  Add the required shadcn/ui components:
  ```
  npx shadcn@latest add button input textarea card badge table dialog
  ```

  This creates `src/components/ui/` with all component files.

  Update `next.config.ts` to add the images remote patterns (for future external images):
  ```typescript
  // next.config.ts
  import type { NextConfig } from 'next'
  const nextConfig: NextConfig = {
    images: {
      remotePatterns: [
        { protocol: 'https', hostname: '**' },
      ],
    },
  }
  export default nextConfig
  ```

  **Verify:** `npm run build` completes without TypeScript or lint errors.

---

- [ ] 3. **TASK-03 — Configure Tailwind CSS and global styles**

  Modify `tailwind.config.ts` to add a custom brand color palette and font family:
  ```typescript
  // tailwind.config.ts
  import type { Config } from 'tailwindcss'
  const config: Config = {
    darkMode: ['class'],
    content: [
      './src/pages/**/*.{ts,tsx}',
      './src/components/**/*.{ts,tsx}',
      './src/app/**/*.{ts,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          brand: {
            DEFAULT: '#1a3a5c',  // deep navy — publisher primary
            light: '#2e5f8a',
            dark: '#0f2238',
          },
          accent: {
            DEFAULT: '#c9a84c',  // warm gold — book/literary accent
            light: '#e0c170',
            dark: '#a07c2a',
          },
        },
        fontFamily: {
          heading: ['var(--font-playfair)', 'Georgia', 'serif'],
          body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        },
      },
    },
    plugins: [require('tailwindcss-animate')],
  }
  export default config
  ```

  Modify `src/app/globals.css` to import Google Fonts via `next/font` and set base styles. Update `src/app/layout.tsx` to declare the fonts using `next/font/google`:
  ```typescript
  // Inside layout.tsx — font declarations
  import { Playfair_Display, Inter } from 'next/font/google'
  const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
  })
  const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
  })
  ```

  Apply `${playfair.variable} ${inter.variable}` classes to the `<html>` element.

  **Verify:** `npm run dev` — the dev server starts and the custom font (`Playfair Display`) renders in the browser on the default page.

---

- [ ] 4. **TASK-04 — Create placeholder book data**

  Create `src/data/books.ts` with an array of 10 books using Arabic/Middle Eastern literary themes. Each entry must include all fields defined in the `Book` type (item 5 below). The 10 books are:

  | # | slug | title | genre |
  |---|---|---|---|
  | 1 | `the-desert-chronicles` | The Desert Chronicles | Literary Fiction |
  | 2 | `whispers-of-the-nile` | Whispers of the Nile | Historical Fiction |
  | 3 | `between-two-worlds` | Between Two Worlds | Contemporary Fiction |
  | 4 | `the-cedar-tree` | The Cedar Tree | Poetry |
  | 5 | `nights-of-beirut` | Nights of Beirut | Memoir |
  | 6 | `the-last-calligrapher` | The Last Calligrapher | Historical Fiction |
  | 7 | `sands-of-time` | Sands of Time | Philosophy |
  | 8 | `the-olive-branch` | The Olive Branch | Political Fiction |
  | 9 | `voices-from-the-medina` | Voices from the Medina | Short Stories |
  | 10 | `journey-to-damascus` | Journey to Damascus | Travel Writing |

  For each book set `author: 'Ibrahim Fawaz Araji'`, a plausible `publishedYear` (between 2010–2024), a placeholder `synopsis` (2–3 sentences), `coverImage: '/images/books/[slug]-cover.jpg'`, a plausible `isbn`, `featured: true` for books 1–4, and `sortOrder` from 1–10.

  **Files:** `src/data/books.ts`

  **Verify:** `npx tsc --noEmit` reports no errors in `src/data/books.ts`.

---

- [ ] 5. **TASK-05 — Create TypeScript types**

  Create `src/types/index.ts` with these exported interfaces/types, exactly matching the Prisma schema and data shapes:

  ```typescript
  export interface Book {
    id: string
    slug: string
    title: string
    author: string
    synopsis: string
    coverImage: string
    publishedYear: number
    genre: string
    isbn?: string
    contentUrl?: string
    featured: boolean
    sortOrder: number
    createdAt?: Date
    updatedAt?: Date
  }

  export interface ContactSubmission {
    id: string
    name: string
    email: string
    subject?: string | null
    message: string
    ipAddress?: string | null
    userAgent?: string | null
    status: 'NEW' | 'READ' | 'REPLIED'
    createdAt: Date
    updatedAt: Date
  }

  export interface AdminUser {
    id: string
    email: string
    passwordHash: string
    name?: string | null
    createdAt: Date
  }

  export interface FAQ {
    question: string
    answer: string
  }

  export interface BreadcrumbItem {
    label: string
    href: string
  }
  ```

  **Files:** `src/types/index.ts`

  **Verify:** `npx tsc --noEmit` — no TypeScript errors across Phase 1 files.

---

## Phase 2 — Database Setup (TASK-06 to TASK-08)

- [ ] 6. **TASK-06 — Write Prisma schema**

  Replace the auto-generated `prisma/schema.prisma` with the full schema from `design.md §4`:

  ```prisma
  generator client {
    provider = "prisma-client-js"
  }

  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }

  model Book {
    id            String   @id @default(cuid())
    slug          String   @unique
    title         String
    author        String
    synopsis      String   @db.Text
    coverImage    String
    publishedYear Int
    genre         String
    isbn          String?
    contentUrl    String?
    featured      Boolean  @default(false)
    sortOrder     Int      @default(0)
    createdAt     DateTime @default(now())
    updatedAt     DateTime @updatedAt
  }

  model ContactSubmission {
    id          String            @id @default(cuid())
    name        String
    email       String
    subject     String?
    message     String            @db.Text
    ipAddress   String?
    userAgent   String?           @db.Text
    status      SubmissionStatus  @default(NEW)
    createdAt   DateTime          @default(now())
    updatedAt   DateTime          @updatedAt
  }

  model AdminUser {
    id           String   @id @default(cuid())
    email        String   @unique
    passwordHash String
    name         String?
    createdAt    DateTime @default(now())
  }

  enum SubmissionStatus {
    NEW
    READ
    REPLIED
  }
  ```

  **Files:** `prisma/schema.prisma`

  **Verify:** `npx prisma validate` — exits with no errors.

---

- [ ] 7. **TASK-07 — Create Prisma client singleton**

  Create `src/lib/prisma.ts` with the standard Next.js singleton pattern that prevents multiple Prisma client instances during hot-reload in development:

  ```typescript
  import { PrismaClient } from '@prisma/client'

  const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

  export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })

  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

  export default prisma
  ```

  **Files:** `src/lib/prisma.ts`

  **Verify:** `npx tsc --noEmit` — no errors. (`npx prisma generate` must have run so `@prisma/client` types exist; run it if needed: `npx prisma generate`.)

---

- [ ] 8. **TASK-08 — Write database seed script**

  Create `prisma/seed.ts`. This script:
  1. Imports the 10 books from `src/data/books.ts` and upserts each into the `Book` table using `prisma.book.upsert` keyed on `slug`.
  2. Creates 1 admin user: name `"Ibrahim Fawaz Araji"`, email `"bonahid@araji.com"`, password `"Admin2026!"` hashed with `bcryptjs` (salt rounds: 12). Use `upsert` keyed on email so re-running the seed is idempotent.

  Add the seed script reference to `package.json`:
  ```json
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
  ```

  Install `ts-node` as a dev dependency: `npm install --save-dev ts-node`.

  **Files:** `prisma/seed.ts`, `package.json`

  **Verify:** The seed script compiles without TypeScript errors (`npx tsc --noEmit`). Actual execution against a live DB is deferred until RDS is available; document this clearly in a comment at the top of `seed.ts`.

---

## Phase 3 — Layout & Shared Components (TASK-09 to TASK-12)

- [ ] 9. **TASK-09 — Build root layout**

  Rewrite `src/app/layout.tsx` to:
  - Declare Playfair Display and Inter fonts via `next/font/google` (as set up in item 3).
  - Export a `metadata` object with: `title: { template: '%s | Ibrahim Fawaz Araji', default: 'Ibrahim Fawaz Araji — Book Publisher' }`, `description`, `metadataBase` set to `new URL(process.env.NEXTAUTH_URL ?? 'http://localhost:3000')`, and default Open Graph / Twitter Card tags.
  - Import and render `<Header />` and `<Footer />` around `{children}`.
  - Wrap body in a semantic `<div>` with `min-h-screen flex flex-col` for sticky footer.

  **Files:** `src/app/layout.tsx`

  **Verify:** `npm run dev` — layout renders (header + footer visible) on the default Next.js page. No console errors.

---

- [ ] 10. **TASK-10 — Build Header component**

  Create `src/components/layout/Header.tsx` as a client component (`'use client'`) because of mobile menu state.

  Requirements:
  - Left side: publisher name `"Ibrahim Fawaz Araji"` as styled text + optional logo SVG placeholder, linking to `/`.
  - Right side (desktop): navigation links — Home (`/`), Books (`/books`), About (`/about`), Contact (`/contact`).
  - Mobile: hamburger button toggles a slide-down nav menu (use `useState` for open/close).
  - Use `next/navigation`'s `usePathname()` to highlight the active link.
  - Semantic markup: `<header>` → `<nav>` with `aria-label="Main navigation"`.
  - Keyboard accessible: hamburger button has `aria-expanded` and `aria-controls`.
  - Styling: deep navy background (`bg-brand-DEFAULT`), white text, gold accent on active links.

  **Files:** `src/components/layout/Header.tsx`

  **Verify:** `npm run dev` — header renders on desktop and mobile breakpoints; active link is highlighted; hamburger opens/closes the menu.

---

- [ ] 11. **TASK-11 — Build Footer component**

  Create `src/components/layout/Footer.tsx` as a server component.

  Requirements:
  - Copyright: `© {currentYear} Ibrahim Fawaz Araji. All rights reserved.`
  - Quick links column: Home, Books, About, Contact.
  - Contact column: email `bonahid@araji.com` as a `mailto:` link.
  - Social media icon links (placeholder `href="#"` until real URLs provided): Twitter/X, LinkedIn, Facebook, Instagram. Use SVG icons or a simple text fallback.
  - Semantic markup: `<footer>` → `<div>` grid layout.
  - Accessible: social icon links have `aria-label`.

  **Files:** `src/components/layout/Footer.tsx`

  **Verify:** `npm run dev` — footer appears at the bottom of every page with all links rendering correctly.

---

- [ ] 12. **TASK-12 — Build Breadcrumb component**

  Create `src/components/layout/Breadcrumb.tsx` as a server component.

  Requirements:
  - Props: `items: BreadcrumbItem[]` (import type from `src/types/index.ts`).
  - Render as `<nav aria-label="Breadcrumb">` → `<ol>` with `<li>` items separated by `›`.
  - Last item is the current page (non-linked, `aria-current="page"`).
  - Inline a `<script type="application/ld+json">` with `BreadcrumbList` JSON-LD (call `breadcrumbSchema(items)` from `src/lib/structured-data.ts` — note: `structured-data.ts` is written in Phase 7, item 26; for now, call the function and it will be resolved when Phase 7 runs; or stub the function early in this file and replace it in Phase 7).
  - **Decision:** Stub `breadcrumbSchema` inline in `Breadcrumb.tsx` for Phase 3, returning a minimal valid script tag. Phase 7 item 26 will replace it with the full helper from `src/lib/structured-data.ts`.

  **Files:** `src/components/layout/Breadcrumb.tsx`

  **Verify:** `npm run dev` — Breadcrumb renders correctly on a test page. `npx tsc --noEmit` — no errors.

---

## Phase 4 — Public Pages (TASK-13 to TASK-17)

**Dependency:** Phase 3 must be complete (Header, Footer, Breadcrumb available).  
All pages go in `src/app/` following Next.js App Router conventions. Each page is a server component by default; client interactivity is isolated to sub-components.

- [ ] 13. **TASK-13 — Build Home page**

  Rewrite `src/app/page.tsx`.

  Sections (all as sub-components or inline JSX):
  1. **HeroSection** — full-width section: `<h1>Ibrahim Fawaz Araji</h1>`, tagline `"Weaving Stories from the Heart of the Arab World"`, CTA button `→ /books` using shadcn `<Button>`.
  2. **FeaturedBooks** — horizontal scroll or 4-column grid of the 4 books where `featured: true` from `src/data/books.ts`. Each card: cover image (placeholder `<Image>` with `alt`), title, genre, `"Read More"` link to `/books/[slug]`.
  3. **AboutBlurb** — 2–3 sentence teaser about the publisher + `<Link href="/about">Learn More →</Link>`.
  4. **GetInTouch CTA** — call-to-action section: headline + `<Button>` → `/contact`.

  Metadata:
  ```typescript
  export const metadata: Metadata = {
    title: 'Ibrahim Fawaz Araji — Book Publisher',
    description: 'Explore the works of Ibrahim Fawaz Araji, author of 10 celebrated books spanning literary fiction, poetry, and memoir rooted in Arab heritage.',
    alternates: { canonical: '/' },
    openGraph: { title: '...', description: '...', images: ['/og/home-og.png'], type: 'website' },
    twitter: { card: 'summary_large_image', ... },
  }
  ```

  JSON-LD: inline `<script type="application/ld+json">` with `websiteSchema()` and `organizationSchema()`. Stub these inline for now; Phase 7 replaces them.

  **Files:** `src/app/page.tsx`  
  Create placeholder OG image: `public/og/home-og.png` (a 1200×630 solid-color PNG placeholder).

  **Verify:** `npm run dev` — home page renders all 4 sections; `view-source` shows `<title>` and `<meta name="description">` tags.

---

- [ ] 14. **TASK-14 — Build Books Catalog page**

  Create `src/app/books/page.tsx`.

  This page is a **server component** that passes all 10 books to a client component `BookGrid` for filtering.

  Create the following sub-components:
  - `src/components/books/BookCard.tsx` — card with cover `<Image>`, title (`<h2>`), author, genre badge (shadcn `<Badge>`), year, and `"Read More"` `<Link>` button.
  - `src/components/books/BookGrid.tsx` — `'use client'` component. Receives `books: Book[]` prop. Renders a search `<input>` and genre filter `<select>`. Filters the list client-side using `useState`/`useMemo`. Renders `<BookCard>` for each filtered result in a responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`).

  Metadata:
  ```typescript
  export const metadata: Metadata = {
    title: 'Books',
    description: 'Browse all 10 books by Ibrahim Fawaz Araji — literary fiction, poetry, memoir, and more rooted in Arab culture.',
    alternates: { canonical: '/books' },
    openGraph: { ... },
    twitter: { ... },
  }
  ```

  JSON-LD: inline `CollectionPage` schema stub (replaced in Phase 7).

  **Files:** `src/app/books/page.tsx`, `src/components/books/BookCard.tsx`, `src/components/books/BookGrid.tsx`

  **Verify:** `npm run dev` — `/books` shows all 10 books; typing in the search box filters results; genre dropdown filters by genre.

---

- [ ] 15. **TASK-15 — Build Book Detail page**

  Create `src/app/books/[slug]/page.tsx`.

  This is a statically generated page (`generateStaticParams` + `generateMetadata`).

  Requirements:
  - `generateStaticParams()` — returns `[{ slug: 'the-desert-chronicles' }, ...]` for all 10 slugs from `src/data/books.ts`.
  - `generateMetadata({ params })` — looks up the book by slug, returns unique title, description (first 160 chars of synopsis), `og:image` set to the book's `coverImage`, canonical URL `/books/[slug]`.
  - Page sections:
    1. `<Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Books', href: '/books' }, { label: book.title, href: '' }]} />`
    2. Book header: cover `<Image>` (left), title `<h1>`, author, genre `<Badge>`, year, ISBN.
    3. Synopsis `<section>` with `<h2>Synopsis</h2>`.
    4. "Read Online" `<section>` — placeholder chapter list (5 placeholder chapter titles as `<ol>`).
    5. Social share `<section>`:
       - Create `src/components/books/SocialShare.tsx` (`'use client'`). Renders 4 buttons that call `window.open()` with share URLs for Twitter/X, Facebook, LinkedIn, WhatsApp. Pre-populate URL and title from props.
    6. Related books `<section>` — 3 books from same genre (or random if fewer); render as small `<BookCard>` items.
  - JSON-LD: inline `Book` + `BreadcrumbList` schema stubs (replaced in Phase 7).

  **Files:** `src/app/books/[slug]/page.tsx`, `src/components/books/SocialShare.tsx`

  **Verify:** `npm run dev` — `/books/the-desert-chronicles` loads; `view-source` shows book-specific `<title>` and `og:image`; breadcrumb renders; social share buttons present.

---

- [ ] 16. **TASK-16 — Build About page**

  Create `src/app/about/page.tsx`.

  Sections:
  1. Page header `<h1>About Ibrahim Fawaz Araji</h1>`.
  2. Profile photo: `<Image src="/images/publisher/profile-placeholder.jpg" alt="Ibrahim Fawaz Araji" />` (create the placeholder image in `public/images/publisher/`).
  3. Full bio (placeholder paragraphs — 3–4 paragraphs of text establishing E-E-A-T signals: experience, expertise, publishing philosophy, authoritativeness).
  4. Publishing milestones timeline: a `<ul>` or `<ol>` styled timeline, with 6–8 placeholder milestones (year + event).
  5. CTA section: `<Button>` → `/contact`.

  Metadata:
  ```typescript
  export const metadata: Metadata = {
    title: 'About',
    description: 'Learn about Ibrahim Fawaz Araji, celebrated Arab author and publisher of 10 acclaimed works spanning literary fiction, poetry, and memoir.',
    alternates: { canonical: '/about' },
    openGraph: { ... },
    twitter: { ... },
  }
  ```

  JSON-LD: inline `Person` + `Organization` schema stubs (replaced in Phase 7).

  Create placeholder images:
  - `public/images/publisher/profile-placeholder.jpg` (a solid-color placeholder)

  **Files:** `src/app/about/page.tsx`, `public/images/publisher/profile-placeholder.jpg`

  **Verify:** `npm run dev` — `/about` renders all sections; `view-source` shows correct metadata.

---

- [ ] 17. **TASK-17 — Build Contact page and ContactForm component**

  Create `src/app/contact/page.tsx` (server component wrapper).  
  Create `src/components/contact/ContactForm.tsx` (client component).  
  Create `src/components/contact/FAQSection.tsx` (server component).

  **ContactForm** (`'use client'`):
  - Fields: Full Name (`<input>`), Email (`<input type="email">`), Subject (`<input>`, optional), Message (`<textarea>`), honeypot field (`<input name="website" tabIndex={-1} style={{ display: 'none' }}`).
  - Client-side validation using the `contactFormSchema` from `src/lib/validations.ts` (written in Phase 5, item 20; stub inline for Phase 4 and replace in Phase 5). On blur, validate each field and show inline error messages.
  - On submit: `fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) })`.
  - Show loading spinner during submission (`isSubmitting` state).
  - On success (200): replace form with thank-you message: `"Thank you, [name]! Your message has been sent."`.
  - On error (400): display field-level errors from the response without losing form data.
  - On error (500): display general error: `"Something went wrong. Please try again."`.
  - All shadcn/ui form components (`Input`, `Textarea`, `Button`).

  **FAQSection**: 5 Q&A items (placeholder questions about the publisher and his books). Renders as `<dl>` with `<dt>` question / `<dd>` answer pairs.

  **Contact page layout**: Two-column grid on desktop: left = `ContactForm`, right = publisher contact details (email, social links) + `FAQSection`.

  Metadata:
  ```typescript
  export const metadata: Metadata = {
    title: 'Contact',
    description: 'Get in touch with Ibrahim Fawaz Araji. Send a message via our contact form or reach out directly by email.',
    alternates: { canonical: '/contact' },
    openGraph: { ... },
    twitter: { ... },
  }
  ```

  JSON-LD: inline `ContactPage` + `FAQPage` + `BreadcrumbList` schema stubs (replaced in Phase 7).

  **Files:** `src/app/contact/page.tsx`, `src/components/contact/ContactForm.tsx`, `src/components/contact/FAQSection.tsx`

  **Verify:** `npm run dev` — `/contact` renders the form with all fields; submitting with an empty name shows a validation error; filling all fields and submitting shows the loading state then success message (when the API returns 200 — or mock the fetch for local testing by checking the 404 from the not-yet-implemented API returns the error state).

---

## Phase 5 — API Routes (TASK-18 to TASK-20)

**Dependency:** Phase 2 (Prisma schema + client) and Phase 4 (ContactForm component) must be complete.

- [ ] 18. **TASK-18 — Build Contact API route**

  Create `src/app/api/contact/route.ts`.

  Logic (in order):
  1. Parse JSON body.
  2. Validate with `contactFormSchema.safeParse(body)` from `src/lib/validations.ts`.
     - If invalid: return `Response.json({ success: false, errors: result.error.flatten().fieldErrors }, { status: 400 })`.
  3. Check honeypot: if `body.honeypot` is non-empty: silently return 200 (don't alert bots).
  4. Extract `x-forwarded-for` header for IP address.
  5. `await prisma.contactSubmission.create({ data: { name, email, subject, message, ipAddress, userAgent, status: 'NEW' } })`.
  6. Call `await sendContactNotification({ name, email, subject, message })` from `src/lib/ses.ts`. Wrap in try/catch — a SES failure should NOT fail the whole request; log the error but return 200.
  7. Return `Response.json({ success: true, message: 'Thank you for your message.' })`.
  8. Catch all errors: return 500.

  Rate limiting: implement simple in-memory rate limiting (Map of IP → [timestamps]). Allow max 5 requests per IP per 60 minutes. If exceeded, return `{ status: 429 }`.

  **Files:** `src/app/api/contact/route.ts`

  **Verify:** `npm run dev` — `curl -X POST http://localhost:3000/api/contact -H "Content-Type: application/json" -d '{"name":"Test","email":"bad-email","message":"hi"}'` returns 400 with error details. A valid payload returns 200 (DB insert may fail locally if no DB — that's expected; validate the 400 path).

---

- [ ] 19. **TASK-19 — Build SES email utility**

  Create `src/lib/ses.ts`.

  ```typescript
  import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

  const ses = new SESClient({ region: process.env.AWS_REGION ?? 'us-east-1' })

  interface SubmissionData {
    name: string
    email: string
    subject?: string | null
    message: string
  }

  export async function sendContactNotification(data: SubmissionData): Promise<void> {
    const subject = `New Contact Form Submission — ${data.subject ?? 'No Subject'}`
    const body = `You have received a new message via your website contact form.

Name:     ${data.name}
Email:    ${data.email}
Subject:  ${data.subject ?? 'N/A'}
Date:     ${new Date().toISOString()}

Message:
${data.message}

---
View all submissions at: ${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/admin`

    const command = new SendEmailCommand({
      Source: process.env.SES_FROM_EMAIL ?? 'bonahid@araji.com',
      Destination: { ToAddresses: [process.env.ADMIN_NOTIFICATION_EMAIL ?? 'bonahid@araji.com'] },
      Message: {
        Subject: { Data: subject, Charset: 'UTF-8' },
        Body: { Text: { Data: body, Charset: 'UTF-8' } },
      },
    })

    await ses.send(command)
  }
  ```

  **Files:** `src/lib/ses.ts`

  **Verify:** `npx tsc --noEmit` — no TypeScript errors. The function is imported by `api/contact/route.ts` without error.

---

- [ ] 20. **TASK-20 — Build Zod validation schemas**

  Create `src/lib/validations.ts`. This file is imported by both the server API route and the client ContactForm component.

  ```typescript
  import { z } from 'zod'

  export const contactFormSchema = z.object({
    name:      z.string().min(2, 'Name must be at least 2 characters').max(100),
    email:     z.string().email('Please enter a valid email address'),
    subject:   z.string().max(200, 'Subject must be under 200 characters').optional(),
    message:   z.string().min(10, 'Message must be at least 10 characters').max(2000),
    honeypot:  z.string().max(0).optional(),  // must be empty
  })

  export type ContactFormData = z.infer<typeof contactFormSchema>
  ```

  After writing this file, go back and **replace the inline stubs** in `ContactForm.tsx` (item 17) with an import from `src/lib/validations.ts`.

  **Files:** `src/lib/validations.ts`, update `src/components/contact/ContactForm.tsx`

  **Verify:** `npx tsc --noEmit` — no errors across all Phase 5 files.

---

## Phase 6 — Admin Portal (TASK-21 to TASK-25)

**Dependency:** Phase 2 (Prisma), Phase 5 (validations) must be complete.

- [ ] 21. **TASK-21 — Configure NextAuth.js**

  Create `src/lib/auth.ts`:
  ```typescript
  import NextAuth from 'next-auth'
  import Credentials from 'next-auth/providers/credentials'
  import { compare } from 'bcryptjs'
  import prisma from '@/lib/prisma'

  export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
      Credentials({
        credentials: {
          email:    { label: 'Email', type: 'email' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) return null
          const user = await prisma.adminUser.findUnique({
            where: { email: credentials.email as string },
          })
          if (!user) return null
          const valid = await compare(credentials.password as string, user.passwordHash)
          if (!valid) return null
          return { id: user.id, email: user.email, name: user.name ?? undefined }
        },
      }),
    ],
    session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },  // 8 hours
    pages: { signIn: '/admin/login' },
    callbacks: {
      async jwt({ token, user }) {
        if (user) token.id = user.id
        return token
      },
      async session({ session, token }) {
        if (session.user) session.user.id = token.id as string
        return session
      },
    },
  })
  ```

  Create `src/app/api/auth/[...nextauth]/route.ts`:
  ```typescript
  import { handlers } from '@/lib/auth'
  export const { GET, POST } = handlers
  ```

  **Files:** `src/lib/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`

  **Verify:** `npx tsc --noEmit` — no errors.

---

- [ ] 22. **TASK-22 — Build admin middleware**

  Create `src/middleware.ts` at the project root (`src/` level, Next.js reads it there):

  ```typescript
  import { auth } from '@/lib/auth'
  import { NextResponse } from 'next/server'

  export default auth((req) => {
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
    const isLoginPage = req.nextUrl.pathname === '/admin/login'

    if (isAdminRoute && !isLoginPage && !req.auth) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  })

  export const config = {
    matcher: ['/admin/:path*'],
  }
  ```

  **Files:** `src/middleware.ts`

  **Verify:** `npm run dev` — navigating to `http://localhost:3000/admin` in the browser redirects to `http://localhost:3000/admin/login`.

---

- [ ] 23. **TASK-23 — Build Admin Login page**

  Create `src/app/admin/login/page.tsx` as a client component.

  Requirements:
  - Email + password fields using shadcn `<Input>`.
  - On submit: call `signIn('credentials', { email, password, redirectTo: '/admin' })` from `next-auth/react`.
  - On error (NextAuth returns an `error` search param): display `"Invalid email or password."`.
  - Read `searchParams.error` from the URL to detect failed login.
  - Show loading spinner during submission.
  - `<title>Admin Login</title>` via `metadata` export.

  Create `src/app/admin/layout.tsx` (minimal layout wrapper, no header/footer for admin — clean admin UI):
  ```typescript
  export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <div className="min-h-screen bg-gray-50">{children}</div>
  }
  ```

  **Files:** `src/app/admin/login/page.tsx`, `src/app/admin/layout.tsx`

  **Verify:** `npm run dev` — `/admin/login` renders the form; entering wrong credentials shows the error message.

---

- [ ] 24. **TASK-24 — Build Admin Dashboard page**

  Create `src/app/admin/page.tsx` as a **server component** (fetches submissions server-side).

  Requirements:
  - Get the session with `auth()` — if no session, redirect to `/admin/login` (fallback, middleware handles this but be defensive).
  - Fetch all submissions: `prisma.contactSubmission.findMany({ orderBy: { createdAt: 'desc' } })`.
  - Count `NEW` submissions for the badge.
  - Pass submissions to client component `SubmissionsTable`.

  Create `src/components/admin/SubmissionsTable.tsx` (`'use client'`):
  - Columns: Date (formatted), Name, Email, Subject, Status badge.
  - Clicking a row opens a `<Dialog>` (shadcn) with full `SubmissionDetail`.
  - Status badges: `NEW` → red, `READ` → blue, `REPLIED` → green.
  - "Mark as Read" / "Mark as Replied" buttons in the dialog call `PATCH /api/admin/submissions/[id]`.
  - After PATCH success, update local state to reflect new status.
  - Pagination: client-side, 10 rows per page using `useState` for page index.

  Create `src/components/admin/SubmissionDetail.tsx` — dialog content showing all fields of a submission.

  Admin page header: `"Contact Submissions"` heading + badge `"{n} New"`.
  Logout button calling `signOut()`.

  **Files:** `src/app/admin/page.tsx`, `src/components/admin/SubmissionsTable.tsx`, `src/components/admin/SubmissionDetail.tsx`

  **Verify:** `npm run dev` — after logging in at `/admin/login`, `/admin` renders the submissions table (empty if no DB). `npx tsc --noEmit` — no errors.

---

- [ ] 25. **TASK-25 — Build Admin Submissions PATCH API**

  Create `src/app/api/admin/submissions/[id]/route.ts`.

  ```typescript
  import { auth } from '@/lib/auth'
  import prisma from '@/lib/prisma'
  import { z } from 'zod'

  const patchSchema = z.object({
    status: z.enum(['NEW', 'READ', 'REPLIED']),
  })

  export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const result = patchSchema.safeParse(body)
    if (!result.success) return Response.json({ error: 'Invalid status' }, { status: 400 })

    const updated = await prisma.contactSubmission.update({
      where: { id: params.id },
      data: { status: result.data.status },
    })
    return Response.json(updated)
  }
  ```

  **Files:** `src/app/api/admin/submissions/[id]/route.ts`

  **Verify:** `npx tsc --noEmit` — no errors. A PATCH request without a session header returns 401 (verify with `curl` or browser DevTools after logging out).

---

## Phase 7 — SEO, AEO, SMO, AIO (TASK-26 to TASK-30)

**Dependency:** All public pages (Phase 4) must be complete so metadata can be audited.

- [ ] 26. **TASK-26 — Create structured data helpers**

  Create `src/lib/structured-data.ts`. Implement all 7 helpers. Each returns a `React.ReactElement` — a `<script type="application/ld+json">` tag with `dangerouslySetInnerHTML`.

  ```typescript
  import type { Book, FAQ, BreadcrumbItem } from '@/types'

  export function websiteSchema() {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Ibrahim Fawaz Araji',
      url: process.env.NEXTAUTH_URL ?? 'http://localhost:3000',
      description: 'Official website of Ibrahim Fawaz Araji, Arab book publisher and author.',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/books?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    }
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  }

  export function organizationSchema() { /* Organization with name, url, email, sameAs */ }
  export function bookSchema(book: Book) { /* Book with name, author, isbn, description, publisher */ }
  export function personSchema() { /* Person with name, jobTitle, description, url */ }
  export function contactPageSchema() { /* ContactPage */ }
  export function faqSchema(faqs: FAQ[]) { /* FAQPage with mainEntity Question/Answer pairs */ }
  export function breadcrumbSchema(items: BreadcrumbItem[]) { /* BreadcrumbList */ }
  ```

  After creating this file:
  - **Replace all inline schema stubs** in the public pages (items 13–17) with imports from `src/lib/structured-data.ts`.
  - **Replace the stub in `Breadcrumb.tsx`** (item 12) with `breadcrumbSchema(items)` from this file.

  **Files:** `src/lib/structured-data.ts`; update `src/app/page.tsx`, `src/app/books/page.tsx`, `src/app/books/[slug]/page.tsx`, `src/app/about/page.tsx`, `src/app/contact/page.tsx`, `src/components/layout/Breadcrumb.tsx`

  **Verify:** `npm run dev` — `view-source` on `/` shows `<script type="application/ld+json">` block with `"@type":"WebSite"`. `npx tsc --noEmit` — no errors.

---

- [ ] 27. **TASK-27 — Generate sitemap.xml**

  Create `src/app/sitemap.ts` (Next.js auto-generates `/sitemap.xml` from this file):

  ```typescript
  import type { MetadataRoute } from 'next'
  import { books } from '@/data/books'

  export default function sitemap(): MetadataRoute.Sitemap {
    const base = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
    const staticRoutes = [
      { url: `${base}/`,        lastModified: new Date(), changeFrequency: 'weekly'  as const, priority: 1.0 },
      { url: `${base}/books`,   lastModified: new Date(), changeFrequency: 'weekly'  as const, priority: 0.9 },
      { url: `${base}/about`,   lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
      { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'yearly'  as const, priority: 0.6 },
    ]
    const bookRoutes = books.map(book => ({
      url: `${base}/books/${book.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
    return [...staticRoutes, ...bookRoutes]
  }
  ```

  **Files:** `src/app/sitemap.ts`

  **Verify:** `npm run dev` — `http://localhost:3000/sitemap.xml` returns valid XML with 14 URLs (4 static + 10 books).

---

- [ ] 28. **TASK-28 — Generate robots.txt**

  Create `src/app/robots.ts`:

  ```typescript
  import type { MetadataRoute } from 'next'

  export default function robots(): MetadataRoute.Robots {
    const base = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
    return {
      rules: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/admin', '/api'],
        },
      ],
      sitemap: `${base}/sitemap.xml`,
    }
  }
  ```

  **Files:** `src/app/robots.ts`

  **Verify:** `npm run dev` — `http://localhost:3000/robots.txt` returns the correct rules with `Disallow: /admin` and `Sitemap:` directive.

---

- [ ] 29. **TASK-29 — Create llms.txt**

  Create `public/llms.txt` with this content (describing the site for AI crawlers):

  ```
  # Ibrahim Fawaz Araji — Book Publisher Website

  ## Purpose
  This is the official website of Ibrahim Fawaz Araji, an Arab author and book publisher.
  The site showcases his 10 published works and provides a way for readers to contact him.

  ## Key Entities
  - Publisher: Ibrahim Fawaz Araji
  - Contact Email: bonahid@araji.com
  - Genre Focus: Literary Fiction, Historical Fiction, Poetry, Memoir, Philosophy
  - Books: 10 titles spanning Arab and Middle Eastern themes

  ## Site Structure
  - / — Home page with featured books and publisher introduction
  - /books — Complete catalog of all 10 books
  - /books/[slug] — Individual book detail pages with synopsis and reading section
  - /about — Publisher biography, history, and publishing philosophy
  - /contact — Contact form for reader inquiries

  ## Content Guidelines for AI
  - All book content is original work by Ibrahim Fawaz Araji
  - Publisher information is factual and E-E-A-T compliant
  - Do not reproduce full book synopses without attribution
  - Contact form submissions are stored privately and not publicly accessible
  ```

  **Files:** `public/llms.txt`

  **Verify:** `npm run dev` — `http://localhost:3000/llms.txt` returns the file content.

---

- [ ] 30. **TASK-30 — Audit and verify all metadata**

  Perform a metadata audit across all pages. Check each page and fix any gaps:

  | Page | `<title>` | `<meta description>` | `og:image` | JSON-LD type |
  |---|---|---|---|---|
  | `/` | Ibrahim Fawaz Araji — Book Publisher | ✓ ≤160 chars | `/og/home-og.png` | WebSite, Organization |
  | `/books` | Books \| Ibrahim Fawaz Araji | ✓ | `/og/books-og.png` | CollectionPage |
  | `/books/[slug]` | [Book Title] \| Ibrahim Fawaz Araji | ✓ (from synopsis) | book.coverImage | Book, BreadcrumbList |
  | `/about` | About \| Ibrahim Fawaz Araji | ✓ | `/og/about-og.png` | Person, Organization |
  | `/contact` | Contact \| Ibrahim Fawaz Araji | ✓ | `/og/contact-og.png` | ContactPage, FAQPage |

  Create placeholder OG images in `public/og/` for any missing:  
  `books-og.png`, `about-og.png`, `contact-og.png` (1200×630 solid-color PNGs).

  Verify no two pages share the same `<title>` value. Verify all `<meta name="description">` tags are under 160 characters.

  **Files:** Potential updates to any page's `generateMetadata()` function; `public/og/*.png` placeholder images.

  **Verify:** `npm run build` completes without errors. Run `npm run dev` and manually inspect `view-source` for each page's title and OG tags.

---

## Phase 8 — AWS Infrastructure Scripts (TASK-31 to TASK-37)

**Note:** These scripts are written to disk and documented for the user to run manually. The coder writes the files — it does NOT execute them. All scripts go in `infrastructure/`.

- [ ] 31. **TASK-31 — Write VPC provisioning script**

  Create `infrastructure/01-vpc.sh`. The script:
  1. Sets `set -euo pipefail` and a `REGION=us-east-1` variable.
  2. Creates a VPC with CIDR `10.0.0.0/16`, tags it `book-publisher-vpc`.
  3. Creates a public subnet `10.0.1.0/24` in `us-east-1a`.
  4. Creates a private subnet `10.0.2.0/24` in `us-east-1b`.
  5. Creates an Internet Gateway and attaches it to the VPC.
  6. Creates a public route table with route `0.0.0.0/0 → IGW`.
  7. Associates the public subnet with the public route table.
  8. Enables `map-public-ip-on-launch` on the public subnet.
  9. Outputs all resource IDs (VPC_ID, PUBLIC_SUBNET_ID, PRIVATE_SUBNET_ID, IGW_ID, RTB_ID) as shell variables for use by subsequent scripts.
  10. Saves IDs to `infrastructure/.env.infra` for reuse.

  **Files:** `infrastructure/01-vpc.sh`

  **Verify (for the coder — file creation only):** File exists and contains valid bash syntax. The user runs it manually against AWS.

---

- [ ] 32. **TASK-32 — Write Security Groups script**

  Create `infrastructure/02-security-groups.sh`. The script:
  1. Sources `infrastructure/.env.infra` to read `VPC_ID`.
  2. Creates `ec2-sg`: allows inbound SSH (22) from `0.0.0.0/0` (note: ideally restricted to the user's IP — add a TODO comment), HTTP (80) and HTTPS (443) from `0.0.0.0/0`.
  3. Creates `rds-sg`: allows inbound PostgreSQL (5432) only from `ec2-sg` (using EC2_SG_ID as source).
  4. Saves EC2_SG_ID and RDS_SG_ID to `infrastructure/.env.infra`.

  **Files:** `infrastructure/02-security-groups.sh`

  **Verify:** File exists with valid bash syntax.

---

- [ ] 33. **TASK-33 — Write RDS provisioning script**

  Create `infrastructure/03-rds.sh`. The script:
  1. Sources `infrastructure/.env.infra`.
  2. Creates a DB subnet group `book-publisher-db-subnet-group` using both private and public subnets (as required by RDS for a subnet group).
  3. Generates a random DB password and saves it securely.
  4. Launches RDS PostgreSQL 15, class `db.t3.micro`, 20 GB gp2, encrypted, in the DB subnet group, attached to `rds-sg`.
  5. DB name: `bookpublisher`, username: `dbadmin`.
  6. Sets backup retention to 7 days.
  7. Waits for the instance to reach `available` status (`aws rds wait db-instance-available`).
  8. Outputs the RDS endpoint and saves `DATABASE_URL` to `.env.infra`.

  **Files:** `infrastructure/03-rds.sh`

  **Verify:** File exists with valid bash syntax.

---

- [ ] 34. **TASK-34 — Write EC2 provisioning script**

  Create `infrastructure/04-ec2.sh`. The script:
  1. Sources `infrastructure/.env.infra`.
  2. Gets the latest Amazon Linux 2023 AMI ID for us-east-1 using `aws ssm get-parameter`.
  3. Creates a key pair `book-publisher-key`, saves the private key to `infrastructure/book-publisher-key.pem`, `chmod 400`.
  4. Launches a `t3.small` instance: public subnet, `ec2-sg`, 20 GB gp3 EBS, the key pair.
  5. Allocates an Elastic IP and associates it with the instance.
  6. Waits for the instance to reach `running` status.
  7. Outputs the Elastic IP (public DNS) and saves to `.env.infra`.
  8. Adds `book-publisher-key.pem` to `.gitignore` (append if not present).

  **Files:** `infrastructure/04-ec2.sh`

  **Verify:** File exists with valid bash syntax.

---

- [ ] 35. **TASK-35 — Write EC2 setup script**

  Create `infrastructure/05-ec2-setup.sh`. This is an SSH-executed setup script (not a user-data script). The script is run once on the EC2 instance via SSH. It:
  1. Updates all packages (`sudo yum update -y`).
  2. Installs Node.js 20 via NodeSource repository.
  3. Installs Git (`sudo yum install -y git`).
  4. Installs Nginx (`sudo yum install -y nginx`) and enables it (`sudo systemctl enable nginx`).
  5. Installs PM2 globally (`sudo npm install -g pm2`).
  6. Installs AWS CLI v2.
  7. Configures IAM instance profile access for SSM (assumes instance has SSM role attached — add a TODO to attach the role manually or via 04-ec2.sh).
  8. Prints versions of node, npm, nginx, pm2.

  Usage comment at the top: `# Run: ssh -i infrastructure/book-publisher-key.pem ec2-user@[EC2_PUBLIC_IP] 'bash -s' < infrastructure/05-ec2-setup.sh`

  **Files:** `infrastructure/05-ec2-setup.sh`

  **Verify:** File exists with valid bash syntax.

---

- [ ] 36. **TASK-36 — Write SES configuration script**

  Create `infrastructure/06-ses.sh`. The script:
  1. Verifies the sender email identity `bonahid@araji.com` with SES:  
     `aws ses verify-email-identity --email-address bonahid@araji.com --region us-east-1`
  2. Prints instructions to check the inbox for a verification link.
  3. Lists current sending limits to check if still in sandbox.
  4. Includes commented-out instructions for requesting production access (sandbox exit).
  5. Sends a test email once the identity is verified:  
     `aws ses send-email --from bonahid@araji.com --to bonahid@araji.com ...`

  **Files:** `infrastructure/06-ses.sh`

  **Verify:** File exists with valid bash syntax.

---

- [ ] 37. **TASK-37 — Write SSM Parameter Store script**

  Create `infrastructure/07-ssm-params.sh`. The script:
  1. Sources `infrastructure/.env.infra` to read `DATABASE_URL`.
  2. Generates a `NEXTAUTH_SECRET` using `openssl rand -base64 32`.
  3. Stores each secret as `SecureString` in SSM:
     - `/book-publisher/DATABASE_URL` — from `.env.infra`
     - `/book-publisher/NEXTAUTH_SECRET` — generated value
     - `/book-publisher/SES_FROM_EMAIL` — `bonahid@araji.com`
     - `/book-publisher/ADMIN_EMAIL` — `bonahid@araji.com`
  4. Verifies each parameter is stored: `aws ssm get-parameter --name /book-publisher/DATABASE_URL --with-decryption`.

  **Files:** `infrastructure/07-ssm-params.sh`

  **Verify:** File exists with valid bash syntax.

---

## Phase 9 — Deployment Config (TASK-38 to TASK-40)

- [ ] 38. **TASK-38 — Write deployment script**

  Create `infrastructure/08-deploy.sh`. This script runs on the EC2 instance to deploy or update the app. Steps:
  1. Pulls SSM parameters and writes `.env` to the app directory.
  2. `git clone` on first deploy / `git pull` on subsequent runs.
  3. `cd /home/ec2-user/book-publisher-app && npm ci --omit=dev`.
  4. `npx prisma migrate deploy`.
  5. `npx prisma db seed` (idempotent — upsert in seed.ts).
  6. `npm run build`.
  7. `pm2 startOrRestart ecosystem.config.js --env production` (or `pm2 reload` if already running).
  8. `pm2 save`.

  Usage comment: `# Run on EC2: ssh -i ... ec2-user@[IP] 'bash -s' < infrastructure/08-deploy.sh`

  **Files:** `infrastructure/08-deploy.sh`

  **Verify:** File exists with valid bash syntax.

---

- [ ] 39. **TASK-39 — Write Nginx configuration**

  Create `infrastructure/nginx.conf` with the full Nginx configuration from `design.md §11`:

  ```nginx
  server {
      listen 80;
      server_name _;

      location / {
          proxy_pass http://localhost:3000;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_cache_bypass $http_upgrade;
      }

      add_header X-Content-Type-Options "nosniff";
      add_header X-Frame-Options "SAMEORIGIN";
      add_header X-XSS-Protection "1; mode=block";
      add_header Referrer-Policy "strict-origin-when-cross-origin";
      add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:;";
  }
  ```

  Add deployment instructions as a comment at the top:
  ```
  # Deploy: sudo cp infrastructure/nginx.conf /etc/nginx/conf.d/book-publisher.conf
  #         sudo nginx -t && sudo systemctl reload nginx
  ```

  **Files:** `infrastructure/nginx.conf`

  **Verify:** File exists and is syntactically valid Nginx config (the user validates with `nginx -t` on EC2).

---

- [ ] 40. **TASK-40 — Write PM2 configuration**

  Create `infrastructure/ecosystem.config.js`:

  ```javascript
  module.exports = {
    apps: [
      {
        name: 'book-publisher',
        script: 'node_modules/.bin/next',
        args: 'start',
        cwd: '/home/ec2-user/book-publisher-app',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '512M',
        env: {
          NODE_ENV: 'development',
          PORT: 3000,
        },
        env_production: {
          NODE_ENV: 'production',
          PORT: 3000,
        },
      },
    ],
  }
  ```

  Add comment: `# After first deploy: pm2 startup && pm2 save` for auto-restart on reboot.

  **Files:** `infrastructure/ecosystem.config.js`

  **Verify:** `node -e "require('./infrastructure/ecosystem.config.js')"` — no syntax errors.

---

## Phase 10 — Final Verification Docs (TASK-41 to TASK-45)

**Note:** Phase 10 items produce Markdown documents in `.agents/tasks/` that record verification checklists and test notes for the user's review. They are not automated test suites.

- [ ] 41. **TASK-41 — Document E2E contact form test procedure**

  Create `.agents/tasks/e2e-contact-form.md`:

  ```markdown
  # E2E Test: Contact Form → Admin Portal → SES Email

  ## Prerequisites
  - App deployed on EC2 and reachable via EC2 public DNS
  - RDS connected and Prisma migrations applied
  - SES identity verified and out of sandbox (or test using verified address)

  ## Steps
  1. Navigate to http://[EC2_PUBLIC_DNS]/contact
  2. Fill in: Name=Test User, Email=test@example.com, Subject=Test Submission, Message=This is a test message for E2E verification.
  3. Click Submit.
  4. Expected: Thank-you confirmation message appears on page.
  5. Navigate to http://[EC2_PUBLIC_DNS]/admin (log in if prompted).
  6. Expected: New submission appears in the table with status "NEW".
  7. Check inbox at bonahid@araji.com.
  8. Expected: Email with subject "New Contact Form Submission — Test Submission" received.

  ## Pass Criteria
  - [ ] Form submits without errors
  - [ ] Submission visible in admin portal
  - [ ] Email notification received at bonahid@araji.com
  ```

  **Files:** `.agents/tasks/e2e-contact-form.md`

---

- [ ] 42. **TASK-42 — Document admin portal test procedure**

  Create `.agents/tasks/e2e-admin-portal.md`:

  ```markdown
  # E2E Test: Admin Portal

  ## Steps
  1. Navigate to http://[EC2_PUBLIC_DNS]/admin (should redirect to /admin/login).
  2. Enter email: bonahid@araji.com, password: Admin2026!
  3. Expected: Redirected to /admin dashboard.
  4. Click a submission row.
  5. Expected: Detail dialog opens showing full message.
  6. Click "Mark as Read".
  7. Expected: Status badge changes to "READ" in the table.
  8. Verify in DB: `SELECT status FROM "ContactSubmission" WHERE id='...'` returns 'READ'.

  ## Pass Criteria
  - [ ] /admin redirects unauthenticated users to /admin/login
  - [ ] Login with correct credentials succeeds
  - [ ] Submission table renders all entries
  - [ ] Status update reflects immediately in UI
  - [ ] DB row updated correctly
  ```

  **Files:** `.agents/tasks/e2e-admin-portal.md`

---

- [ ] 43. **TASK-43 — Document security audit checklist**

  Create `.agents/tasks/security-audit.md`:

  ```markdown
  # Security Audit Checklist

  ## Authentication & Authorization
  - [ ] /admin redirects to /admin/login when not authenticated
  - [ ] /admin/login with wrong credentials shows error, does not grant access
  - [ ] /api/admin/submissions/[id] PATCH returns 401 without valid session
  - [ ] Session expires after 8 hours of inactivity (set in NextAuth config)

  ## API Security
  - [ ] /api/contact validates all fields server-side (returns 400 for invalid input)
  - [ ] Honeypot field check: submitting with non-empty honeypot is silently accepted (no error) but not stored
  - [ ] Rate limiting: > 5 submissions from same IP per hour returns 429

  ## robots.txt
  - [ ] /robots.txt disallows /admin
  - [ ] /robots.txt disallows /api
  - [ ] All public pages are allowed

  ## Headers (verify in browser DevTools or curl -I)
  - [ ] X-Content-Type-Options: nosniff
  - [ ] X-Frame-Options: SAMEORIGIN
  - [ ] Referrer-Policy: strict-origin-when-cross-origin
  - [ ] Content-Security-Policy header present

  ## Data
  - [ ] Passwords stored as bcrypt hashes (never plaintext) — verify in DB
  - [ ] DATABASE_URL not hardcoded in source; loaded from SSM/env
  - [ ] NEXTAUTH_SECRET not hardcoded in source
  ```

  **Files:** `.agents/tasks/security-audit.md`

---

- [ ] 44. **TASK-44 — Document SEO / Rich Results verification notes**

  Create `.agents/tasks/seo-verification.md`:

  ```markdown
  # SEO & Rich Results Verification Notes

  ## Google Rich Results Test
  Test these URLs at https://search.google.com/test/rich-results

  | Page | URL | Expected Schema | Status |
  |---|---|---|---|
  | Home | http://[EC2]/  | WebSite, Organization | [ ] |
  | Books Catalog | http://[EC2]/books | CollectionPage | [ ] |
  | Book Detail | http://[EC2]/books/the-desert-chronicles | Book, BreadcrumbList | [ ] |
  | About | http://[EC2]/about | Person, Organization | [ ] |
  | Contact | http://[EC2]/contact | ContactPage, FAQPage, BreadcrumbList | [ ] |

  ## Metadata Checks
  Run in browser DevTools (view-source on each page):
  - [ ] Every page has a unique <title> (max 60 chars)
  - [ ] Every page has <meta name="description"> (max 160 chars)
  - [ ] Every page has og:title, og:description, og:image, og:url
  - [ ] Every page has twitter:card, twitter:title, twitter:image
  - [ ] Every page has rel="canonical" link

  ## Sitemap
  - [ ] /sitemap.xml returns valid XML
  - [ ] Sitemap contains all 14 URLs (4 static + 10 books)
  - [ ] Submit sitemap to Google Search Console

  ## robots.txt
  - [ ] /robots.txt references sitemap URL
  - [ ] /robots.txt disallows /admin and /api

  ## llms.txt
  - [ ] /llms.txt is accessible
  ```

  **Files:** `.agents/tasks/seo-verification.md`

---

- [ ] 45. **TASK-45 — Document Lighthouse audit targets**

  Create `.agents/tasks/lighthouse-audit.md`:

  ```markdown
  # Lighthouse Audit Targets and Procedure

  ## Target Scores
  | Metric | Target | Minimum |
  |---|---|---|
  | Performance (mobile) | 85+ | 75 |
  | Performance (desktop) | 90+ | 85 |
  | SEO | 90+ | 90 |
  | Accessibility | 90+ | 90 |
  | Best Practices | 90+ | 85 |

  ## How to Run
  1. Open Chrome DevTools → Lighthouse tab
  2. Select: Mobile, all categories
  3. Run on: Home page (http://[EC2]/) and one Book Detail page (http://[EC2]/books/the-desert-chronicles)
  4. Record scores below.

  ## Results Log (fill in after deployment)
  | Page | Perf (mob) | Perf (desk) | SEO | A11y | Best Practices |
  |---|---|---|---|---|---|
  | Home / | | | | | |
  | /books/the-desert-chronicles | | | | | |

  ## Known Optimizations Already Applied
  - next/font for fonts (no FOUT)
  - next/image with lazy loading and WebP
  - SSG for book detail pages (generateStaticParams)
  - Semantic HTML5 elements throughout
  - All images have alt attributes
  - ARIA labels on interactive elements
  - Metadata on every page
  ```

  **Files:** `.agents/tasks/lighthouse-audit.md`

---

## Build Verification Commands (Run After Each Phase)

```bash
# After Phase 1
npx tsc --noEmit
npm run lint

# After Phase 2
npx prisma validate
npx tsc --noEmit

# After Phase 3
npm run dev   # manual visual check

# After Phase 4
npx tsc --noEmit
npm run lint

# After Phase 5
npx tsc --noEmit
npm run build

# After Phase 6
npx tsc --noEmit
npm run build

# After Phase 7
npm run build   # full production build — catches all type + import errors

# After Phase 8
# (scripts only — no build step; review bash syntax)

# After Phase 9
node -e "require('./infrastructure/ecosystem.config.js')"

# After Phase 10
npm run build   # final clean build
```

---

## File Creation Checklist (45 files + directories)

| Phase | Files to Create |
|---|---|
| 1 | `src/data/books.ts`, `src/types/index.ts`, `next.config.ts` (update), `tailwind.config.ts` (update), `src/app/layout.tsx` (update), `.env.example` |
| 2 | `prisma/schema.prisma`, `src/lib/prisma.ts`, `prisma/seed.ts` |
| 3 | `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/components/layout/Breadcrumb.tsx` |
| 4 | `src/app/page.tsx`, `src/app/books/page.tsx`, `src/app/books/[slug]/page.tsx`, `src/app/about/page.tsx`, `src/app/contact/page.tsx`, `src/components/books/BookCard.tsx`, `src/components/books/BookGrid.tsx`, `src/components/books/SocialShare.tsx`, `src/components/contact/ContactForm.tsx`, `src/components/contact/FAQSection.tsx`, `public/og/home-og.png` |
| 5 | `src/app/api/contact/route.ts`, `src/lib/ses.ts`, `src/lib/validations.ts` |
| 6 | `src/lib/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/middleware.ts`, `src/app/admin/login/page.tsx`, `src/app/admin/layout.tsx`, `src/app/admin/page.tsx`, `src/app/api/admin/submissions/[id]/route.ts`, `src/components/admin/SubmissionsTable.tsx`, `src/components/admin/SubmissionDetail.tsx` |
| 7 | `src/lib/structured-data.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`, `public/llms.txt`, `public/og/books-og.png`, `public/og/about-og.png`, `public/og/contact-og.png` |
| 8 | `infrastructure/01-vpc.sh`, `infrastructure/02-security-groups.sh`, `infrastructure/03-rds.sh`, `infrastructure/04-ec2.sh`, `infrastructure/05-ec2-setup.sh`, `infrastructure/06-ses.sh`, `infrastructure/07-ssm-params.sh` |
| 9 | `infrastructure/08-deploy.sh`, `infrastructure/nginx.conf`, `infrastructure/ecosystem.config.js` |
| 10 | `.agents/tasks/e2e-contact-form.md`, `.agents/tasks/e2e-admin-portal.md`, `.agents/tasks/security-audit.md`, `.agents/tasks/seo-verification.md`, `.agents/tasks/lighthouse-audit.md` |
