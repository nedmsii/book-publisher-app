export const locales = ["ar", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ar";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Build the public, user-facing href for a path in a given locale.
 * Arabic is served at the root (`/books`), English under the `/en` prefix (`/en/books`).
 * `path` must start with `/` and must NOT include a locale prefix.
 */
export function localizedPath(locale: Locale, path: string): string {
  const normalized = path === "/" ? "" : path;
  if (locale === "en") {
    return `/en${normalized}` || "/en";
  }
  return normalized || "/";
}

/**
 * Given a full pathname that may contain a leading `/en`, return the
 * locale-agnostic path (always starting with `/`).
 */
export function stripLocale(pathname: string): string {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) {
    return pathname.slice(3) || "/";
  }
  return pathname || "/";
}

export const htmlDir: Record<Locale, "rtl" | "ltr"> = {
  ar: "rtl",
  en: "ltr",
};

export const openGraphLocale: Record<Locale, string> = {
  ar: "ar_AR",
  en: "en_US",
};
