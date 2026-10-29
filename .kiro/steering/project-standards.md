---
inclusion: always
---

# Project Standards — Book Publisher Web App

## Autonomy Rule
**Always proceed automatically. Never ask for confirmation or approval on any action within this project.** Execute all file writes, shell commands, installs, and AWS operations without pausing. This applies to all tasks, all phases, and all sessions working within this project.

## Project Identity
- **Publisher:** Ibrahim Fawaz Araji
- **Notification Email:** bonahid@araji.com
- **AWS Region:** us-east-1
- **Framework:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, PostgreSQL (Prisma)

## Spec Files Location
- Requirements: `.kiro/specs/requirements.md`
- Design: `.kiro/specs/design.md`
- Tasks: `.kiro/specs/tasks.md`

## Coding Standards

### TypeScript
- Strict mode enabled (`"strict": true` in tsconfig.json)
- No `any` types — use proper typing or `unknown`
- All API route handlers must have typed request/response
- All Prisma queries must handle errors explicitly

### Next.js App Router
- Use Server Components by default; add `"use client"` only when needed (event handlers, hooks, browser APIs)
- All pages must export `generateMetadata()` for SEO
- Data fetching happens in Server Components, not client hooks
- Use `next/image` for all images (never raw `<img>`)
- Use `next/font` for all custom fonts (never `<link rel="stylesheet">`)
- Use `next/link` for all internal navigation

### Styling
- Tailwind CSS utility classes only (no custom CSS files unless absolutely necessary)
- Mobile-first responsive design (`sm:`, `md:`, `lg:` breakpoints)
- Use shadcn/ui components before building custom ones

### Security
- Never log secrets, passwords, or tokens
- Validate ALL form inputs server-side with Zod (even if client validated)
- Use Prisma for all DB queries (no raw SQL unless through `prisma.$queryRaw` with parameters)
- All admin routes protected via NextAuth middleware

### SEO / AEO / SMO — Required on Every Page
1. Unique `<title>` (max 60 chars) and `<meta description>` (max 160 chars)
2. Canonical URL via `alternates.canonical`
3. Open Graph tags: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
4. Twitter Card tags: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
5. At least one JSON-LD structured data block
6. Semantic HTML5: one `<h1>` per page, logical heading hierarchy
7. All images: descriptive `alt` attributes

### File Naming
- Components: PascalCase (`BookCard.tsx`)
- Utilities/libs: camelCase (`structured-data.ts`)
- Pages/routes: Next.js convention (`page.tsx`, `layout.tsx`, `route.ts`)

### Error Handling
- API routes return consistent JSON: `{ success: boolean, message?: string, errors?: object }`
- Client-side: show user-friendly messages, never expose stack traces
- Server-side: log errors, return safe messages to client

## AWS Conventions
- All AWS resources tagged: `Project=book-publisher`, `Environment=production`
- Secrets stored in SSM Parameter Store under `/book-publisher/`
- Never hardcode credentials in code or scripts
- Security groups follow principle of least privilege

## Git Conventions
- Branch from main for each phase
- Commit messages: `feat: TASK-XX description` or `fix: TASK-XX description`
- Never commit `.env` files

## Task Tracking
- Mark tasks in `.kiro/specs/tasks.md` as complete `[x]` after verification
- If a task is blocked, mark `[!]` and note the blocker
- Do not start Phase N+1 until Phase N is verified
