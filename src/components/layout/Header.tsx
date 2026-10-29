"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Dictionary } from "@/i18n";
import { localizedPath, stripLocale, type Locale } from "@/i18n/config";

interface HeaderProps {
  lang: Locale;
  dict: Dictionary;
}

export default function Header({ lang, dict }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: localizedPath(lang, "/"), label: dict.nav.home },
    { href: localizedPath(lang, "/books"), label: dict.nav.books },
    { href: localizedPath(lang, "/about"), label: dict.nav.about },
    { href: localizedPath(lang, "/contact"), label: dict.nav.contact },
  ];

  // Keep the visitor on the same page when switching language.
  const basePath = stripLocale(pathname ?? "/");
  const otherLocale: Locale = lang === "ar" ? "en" : "ar";
  const toggleHref = localizedPath(otherLocale, basePath);
  const toggleLabel =
    otherLocale === "ar" ? dict.nav.switchToArabic : dict.nav.switchToEnglish;
  const toggleAria =
    otherLocale === "ar"
      ? dict.nav.switchToArabicAria
      : dict.nav.switchToEnglishAria;

  return (
    <header className="bg-ink-950 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={localizedPath(lang, "/")}
            className="flex flex-col leading-tight hover:opacity-80 transition-opacity"
            aria-label={dict.nav.homeAria}
          >
            <span className="font-serif text-lg font-bold text-brand-400 tracking-wide">
              {dict.meta.authorName}
            </span>
            <span className="text-xs text-ink-300 tracking-widest uppercase">
              {dict.meta.tagline}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label={dict.nav.mainNav} className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ink-200 hover:text-brand-400 transition-colors tracking-wide"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={toggleHref}
              lang={otherLocale}
              hrefLang={otherLocale}
              aria-label={toggleAria}
              className="text-sm font-medium text-ink-200 hover:text-brand-400 border border-ink-700 hover:border-brand-400 rounded px-3 py-1.5 transition-colors tracking-wide"
            >
              {toggleLabel}
            </Link>
            <Link
              href={localizedPath(lang, "/contact")}
              className="bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium px-4 py-2 rounded transition-colors"
            >
              {dict.nav.getInTouch}
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded text-ink-200 hover:text-white hover:bg-ink-800 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label={dict.nav.toggleMenu}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <nav
            aria-label={dict.nav.mobileNav}
            className="md:hidden border-t border-ink-800 py-4"
          >
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block px-3 py-2 text-sm font-medium text-ink-200 hover:text-brand-400 hover:bg-ink-900 rounded transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={toggleHref}
                  lang={otherLocale}
                  hrefLang={otherLocale}
                  aria-label={toggleAria}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-brand-400 hover:bg-ink-900 rounded transition-colors"
                >
                  {toggleLabel}
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
