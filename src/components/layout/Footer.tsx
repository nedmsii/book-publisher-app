import Link from "next/link";
import type { Dictionary } from "@/i18n";
import { localizedPath, type Locale } from "@/i18n/config";
import type { GenreKey } from "@/i18n/types";

interface FooterProps {
  lang: Locale;
  dict: Dictionary;
}

const GENRE_KEYS: GenreKey[] = [
  "Literary Fiction",
  "Historical Fiction",
  "Poetry",
  "Philosophy",
  "Memoir",
  "Cultural Studies",
];

export default function Footer({ lang, dict }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: localizedPath(lang, "/"), label: dict.nav.home },
    { href: localizedPath(lang, "/books"), label: dict.footer.allBooks },
    { href: localizedPath(lang, "/about"), label: dict.footer.aboutTheAuthor },
    { href: localizedPath(lang, "/contact"), label: dict.nav.contact },
  ];

  return (
    <footer className="bg-ink-950 text-ink-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h2 className="font-serif text-white text-lg font-bold mb-2">
              {dict.meta.authorName}
            </h2>
            <p className="text-sm text-ink-400 leading-relaxed mb-4">
              {dict.footer.brandBlurb}
            </p>
            <a
              href="mailto:bonahid@araji.com"
              className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
            >
              bonahid@araji.com
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">
              {dict.footer.explore}
            </h3>
            <nav aria-label={dict.footer.footerNav}>
              <ul className="flex flex-col gap-2">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-400 hover:text-brand-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Genres */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">
              {dict.footer.genresHeading}
            </h3>
            <ul className="flex flex-col gap-2">
              {GENRE_KEYS.map((genre) => (
                <li key={genre}>
                  <Link
                    href={`${localizedPath(lang, "/books")}?genre=${encodeURIComponent(genre)}`}
                    className="text-sm text-ink-400 hover:text-brand-400 transition-colors"
                  >
                    {dict.genres[genre]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-ink-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ink-500">{dict.footer.rights(currentYear)}</p>
          <p className="text-xs text-ink-600">{dict.footer.builtWith}</p>
        </div>
      </div>
    </footer>
  );
}
