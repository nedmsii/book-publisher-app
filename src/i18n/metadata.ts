import type { Metadata } from "next";
import { localizedPath, openGraphLocale, type Locale } from "./config";

export const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";

/**
 * Build the SEO alternates block (canonical + hreflang languages) for a page
 * identified by its locale-agnostic path (e.g. "/", "/books", "/about").
 */
export function buildAlternates(locale: Locale, path: string): Metadata["alternates"] {
  const arUrl = localizedPath("ar", path);
  const enUrl = localizedPath("en", path);
  return {
    canonical: localizedPath(locale, path),
    languages: {
      ar: arUrl,
      en: enUrl,
      "x-default": arUrl,
    },
  };
}

/**
 * openGraph locale + alternate locale for a given active locale.
 */
export function openGraphLocales(locale: Locale): {
  locale: string;
  alternateLocale: string;
} {
  const alternate: Locale = locale === "ar" ? "en" : "ar";
  return {
    locale: openGraphLocale[locale],
    alternateLocale: openGraphLocale[alternate],
  };
}
