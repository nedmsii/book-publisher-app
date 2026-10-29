import Link from "next/link";
import { BreadcrumbItem } from "@/types";
import { breadcrumbSchema, jsonLdScript } from "@/lib/structured-data";
import type { Locale } from "@/i18n/config";

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  lang: Locale;
  ariaLabel: string;
}

export default function Breadcrumb({ items, lang, ariaLabel }: BreadcrumbProps) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbSchema(items, lang)) }}
      />
      <nav aria-label={ariaLabel} className="mb-6">
        <ol className="flex items-center flex-wrap gap-1 text-sm text-ink-400">
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center gap-1">
              {index < items.length - 1 ? (
                <>
                  <Link
                    href={item.href}
                    className="hover:text-brand-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                  <svg
                    className="w-3 h-3 text-ink-300 rtl:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </>
              ) : (
                <span className="text-ink-600 font-medium" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
