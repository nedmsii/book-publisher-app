# Technical Design Specification
## Project: Ibrahim Fawaz Araji — Book Publisher Website
**Version:** 2.0 (Serverless + Bilingual)
**Date:** October 19, 2026
**Status:** Approved

> **v2.0 Architecture Change:** This project moved from an EC2 + RDS PostgreSQL design
> to a **fully serverless** architecture for a permanent, near-zero-cost production site.
> Key decisions:
> - **Hosting:** AWS Amplify Hosting (S3 + CloudFront + Lambda under the hood) — no EC2
> - **Database:** DynamoDB for contact submissions (perpetual free tier) — no RDS
> - **No VPC / subnets / security groups / Nginx / PM2** needed
> - **i18n:** Bilingual Arabic (default, at `/`) + English (at `/en`) with RTL support
> - **CMS:** Intentionally out of scope — static content (books, bio) managed via code edits
> - **Admin portal:** Retained; reads submissions from DynamoDB; single admin credential via env/SSM

---

## 1. Architecture Overview (v2.0 — Serverless)

```
┌──────────────────────────────────────────────────────────┐
│                         CLIENT                            │
│        Browser (Arabic RTL default / English LTR)         │
└────────────────────────────┬─────────────────────────────┘
                             │ HTTPS
┌────────────────────────────▼─────────────────────────────┐
│                  AWS Amplify Hosting (us-east-1)          │
│   CloudFront CDN  →  S3 (static)  +  Lambda (SSR + API)   │
│   ┌──────────────────────────────────────────────────┐   │
│   │  Next.js App                                      │   │
│   │   - Static pages (books, about) via CloudFront    │   │
│   │   - SSR pages + metadata via Lambda               │   │
│   │   - API routes (contact, auth) via Lambda         │   │
│   │   - NextAuth.js (admin, env-based credential)     │   │
│   └───────────────┬───────────────────┬──────────────┘   │
└───────────────────┼───────────────────┼──────────────────┘
                    │                   │
         ┌──────────▼────────┐  ┌───────▼─────────────┐
         │   AWS DynamoDB    │  │      AWS SES        │
         │ contact-          │  │ Email notifications │
         │ submissions table │  │ → bonahid@araji.com │
         │ (free tier)       │  └─────────────────────┘
         └───────────────────┘
                    │
         ┌──────────▼─────────┐
         │ SSM Parameter Store│
         │ (admin creds,      │
         │  NextAuth secret)  │
         └────────────────────┘
```

---

## 2. Technology Stack (v2.0)

| Layer | Technology | Notes |
|---|---|---|
| Runtime | Node.js | 20 LTS |
| Framework | Next.js | 14 (App Router) |
| Language | TypeScript | 5.x (strict) |
| Styling | Tailwind CSS | 3.x |
| i18n | Custom dictionary + RTL | Arabic (default `/`) + English (`/en`) |
| Database | **AWS DynamoDB** | Contact submissions — perpetual free tier |
| DB Client | **@aws-sdk/client-dynamodb + lib-dynamodb** | No ORM |
| Auth | NextAuth.js v5 | Single admin credential via env/SSM |
| Email | AWS SES SDK | v3 |
| Validation | Zod | 3.x |
| Hosting | **AWS Amplify** | S3 + CloudFront + Lambda (serverless) |
| DNS (future) | Route 53 | When custom domain is registered |

> **Removed from v1.0:** PostgreSQL, Prisma, RDS, EC2, Nginx, PM2, VPC, subnets, security groups.

---

## 3. Project Structure

```
book-publisher-app/
├── .kiro/
│   ├── specs/
│   │   ├── requirements.md
│   │   ├── design.md
│   │   └── tasks.md
│   └── steering/
│       └── project-standards.md
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout (header, footer, metadata)
│   │   ├── page.tsx                  # Home page
│   │   ├── sitemap.ts                # Auto-generated sitemap.xml
│   │   ├── robots.ts                 # Auto-generated robots.txt
│   │   │
│   │   ├── books/
│   │   │   ├── page.tsx              # Books catalog
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Book detail / reader
│   │   │
│   │   ├── about/
│   │   │   └── page.tsx              # About publisher
│   │   │
│   │   ├── contact/
│   │   │   └── page.tsx              # Contact form
│   │   │
│   │   ├── admin/
│   │   │   ├── layout.tsx            # Admin layout (auth guard)
│   │   │   ├── page.tsx              # Admin dashboard (submissions)
│   │   │   └── login/
│   │   │       └── page.tsx          # Admin login
│   │   │
│   │   └── api/
│   │       ├── contact/
│   │       │   └── route.ts          # POST /api/contact
│   │       └── auth/
│   │           └── [...nextauth]/
│   │               └── route.ts      # NextAuth.js handler
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Breadcrumb.tsx
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturedBooks.tsx
│   │   │   └── AboutBlurb.tsx
│   │   ├── books/
│   │   │   ├── BookCard.tsx
│   │   │   ├── BookGrid.tsx
│   │   │   ├── BookReader.tsx
│   │   │   └── SocialShare.tsx
│   │   ├── contact/
│   │   │   ├── ContactForm.tsx
│   │   │   └── FAQSection.tsx
│   │   ├── admin/
│   │   │   ├── SubmissionsTable.tsx
│   │   │   └── SubmissionDetail.tsx
│   │   └── ui/                       # shadcn/ui components
│   │
│   ├── lib/
│   │   ├── prisma.ts                 # Prisma client singleton
│   │   ├── ses.ts                    # AWS SES email utility
│   │   ├── auth.ts                   # NextAuth.js config
│   │   ├── validations.ts            # Zod schemas
│   │   └── structured-data.ts        # JSON-LD helpers
│   │
│   ├── data/
│   │   └── books.ts                  # Placeholder book data (10 books)
│   │
│   └── types/
│       └── index.ts                  # Shared TypeScript types
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                       # Seed script (books + admin user)
│
├── public/
│   ├── images/
│   │   ├── books/                    # Placeholder book cover images
│   │   └── publisher/                # Publisher photo placeholder
│   ├── og/                           # Open Graph images
│   └── llms.txt                      # AI crawler description file
│
├── infrastructure/
│   ├── 01-vpc.sh                     # Create VPC, subnets, IGW
│   ├── 02-security-groups.sh         # Create EC2 and RDS security groups
│   ├── 03-rds.sh                     # Launch RDS PostgreSQL instance
│   ├── 04-ec2.sh                     # Launch EC2 instance
│   ├── 05-ses.sh                     # Configure AWS SES
│   ├── 06-ssm-params.sh              # Store secrets in SSM Parameter Store
│   ├── 07-deploy.sh                  # Deploy app to EC2
│   ├── nginx.conf                    # Nginx configuration template
│   └── ecosystem.config.js           # PM2 configuration
│
├── .env.example                      # Environment variable template
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. Database Schema (Prisma)

```prisma
// prisma/schema.prisma

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

**Success Response (200):**
```json
{ "success": true, "message": "Thank you for your message." }
```

**Validation Error (400):**
```json
{ "success": false, "errors": { "email": "Invalid email address" } }
```

**Server Error (500):**
```json
{ "success": false, "message": "Something went wrong. Please try again." }
```

**Side Effects:**
1. Insert row into `contact_submissions` table
2. Send SES email to `bonahid@araji.com`

---

### PATCH `/api/admin/submissions/[id]`
Update submission status (admin only).

**Request Body:**
```json
{ "status": "READ" | "REPLIED" }
```

---

## 6. Page Metadata Strategy

Each page exports a `generateMetadata()` function (Next.js App Router pattern):

```typescript
// Pattern used on every page
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Page Title | Ibrahim Fawaz Araji',
    description: 'Page description under 160 chars',
    alternates: { canonical: 'https://[ec2-host]/page-path' },
    openGraph: {
      title: '...',
      description: '...',
      images: [{ url: '/og/page-og.png' }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: '...',
      description: '...',
      images: ['/og/page-og.png'],
    },
  }
}
```

---

## 7. JSON-LD Structured Data

Centralized in `src/lib/structured-data.ts`:

```typescript
// WebSite schema (Home)
export function websiteSchema() { ... }

// Organization schema (Home, Footer)
export function organizationSchema() { ... }

// Book schema (Book Detail page)
export function bookSchema(book: Book) { ... }

// Person schema (About page)
export function personSchema() { ... }

// ContactPage schema (Contact page)
export function contactPageSchema() { ... }

// FAQPage schema (Contact page)
export function faqSchema(faqs: FAQ[]) { ... }

// BreadcrumbList schema (Book Detail, About, Contact)
export function breadcrumbSchema(items: BreadcrumbItem[]) { ... }
```

---

## 8. Authentication Flow (NextAuth.js v5)

```
User → /admin
  │
  ▼ (middleware check)
Not authenticated?
  │
  └─▶ Redirect to /admin/login
        │
        ▼ (POST credentials)
      NextAuth CredentialsProvider
        │
        ▼ (bcrypt.compare)
      admin_users table
        │
        ├─ Match → Set session cookie → /admin
        └─ No match → Error: "Invalid credentials"
```

Session stored as JWT in HttpOnly cookie. Middleware protects all `/admin/*` routes.

---

## 9. Email Notification Template

Sent via AWS SES when a contact form is submitted:

**Subject:** `New Contact Form Submission — [Subject or "No Subject"]`

**Body:**
```
You have received a new message via your website contact form.

Name:     [name]
Email:    [email]
Subject:  [subject]
Date:     [timestamp]

Message:
[message]

---
View all submissions at: http://[ec2-host]/admin
```

---

## 10. AWS Infrastructure Details

### VPC Configuration
| Resource | Value |
|---|---|
| VPC CIDR | 10.0.0.0/16 |
| Public Subnet | 10.0.1.0/24 (us-east-1a) |
| Private Subnet | 10.0.2.0/24 (us-east-1b) |
| Internet Gateway | Attached to VPC |
| Route Table (public) | 0.0.0.0/0 → IGW |

### EC2 Instance
| Resource | Value |
|---|---|
| AMI | Amazon Linux 2023 (latest) |
| Instance Type | t3.small |
| Subnet | Public (10.0.1.0/24) |
| Key Pair | Generated during setup |
| Storage | 20 GB gp3 EBS |

### RDS Instance
| Resource | Value |
|---|---|
| Engine | PostgreSQL 15 |
| Instance Class | db.t3.micro |
| Storage | 20 GB gp2 |
| Subnet | Private (Multi-AZ subnet group) |
| Backup Retention | 7 days |
| Encryption | At-rest encryption enabled |

### Security Groups
| SG | Inbound Rules |
|---|---|
| ec2-sg | 22 (SSH, your IP only), 80 (HTTP, 0.0.0.0/0), 443 (HTTPS, 0.0.0.0/0) |
| rds-sg | 5432 (PostgreSQL, from ec2-sg only) |

### SSM Parameter Store Keys
```
/book-publisher/DATABASE_URL
/book-publisher/NEXTAUTH_SECRET
/book-publisher/SES_FROM_EMAIL
/book-publisher/ADMIN_EMAIL
```

---

## 11. Nginx Configuration

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

    # Security headers
    add_header X-Content-Type-Options "nosniff";
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}
```

---

## 12. Environment Variables

```bash
# .env (on EC2, loaded from SSM Parameter Store)
DATABASE_URL="postgresql://user:password@rds-endpoint:5432/bookpublisher"
NEXTAUTH_URL="http://ec2-public-dns"
NEXTAUTH_SECRET="[generated 32-char secret]"
AWS_REGION="us-east-1"
SES_FROM_EMAIL="bonahid@araji.com"
ADMIN_NOTIFICATION_EMAIL="bonahid@araji.com"
```
