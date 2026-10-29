import Link from "next/link";
import type { Dictionary } from "@/i18n";
import { localizedPath, type Locale } from "@/i18n/config";

interface HeroSectionProps {
  lang: Locale;
  dict: Dictionary;
}

export default function HeroSection({ lang, dict }: HeroSectionProps) {
  return (
    <section
      className="relative bg-ink-950 text-white overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #db8c28 0, #db8c28 1px, transparent 0, transparent 50%)",
          backgroundSize: "20px 20px",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl">
          <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-4">
            {dict.home.heroEyebrow}
          </p>
          <h1
            id="hero-heading"
            className="font-serif text-4xl md:text-6xl font-bold text-white leading-tight mb-6"
          >
            {dict.meta.authorName}
          </h1>
          <p className="text-xl md:text-2xl text-ink-200 font-serif italic mb-4 leading-relaxed">
            &ldquo;{dict.home.heroQuote}&rdquo;
          </p>
          <p className="text-ink-300 text-lg mb-10 leading-relaxed max-w-2xl">
            {dict.home.heroBody}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={localizedPath(lang, "/books")}
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold px-8 py-3 rounded transition-colors text-sm uppercase tracking-wide"
            >
              {dict.home.exploreBooks}
              <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href={localizedPath(lang, "/about")}
              className="inline-flex items-center gap-2 border border-ink-600 hover:border-brand-400 hover:text-brand-400 text-ink-200 font-semibold px-8 py-3 rounded transition-colors text-sm uppercase tracking-wide"
            >
              {dict.home.aboutTheAuthor}
            </Link>
          </div>
        </div>

        {/* Decorative element */}
        <div
          className="absolute end-8 top-1/2 -translate-y-1/2 hidden lg:block opacity-10"
          aria-hidden="true"
        >
          <svg width="200" height="300" viewBox="0 0 200 300" fill="none">
            <rect x="10" y="10" width="120" height="160" rx="4" fill="#db8c28" />
            <rect x="40" y="50" width="120" height="160" rx="4" fill="#db8c28" />
            <rect x="70" y="90" width="120" height="160" rx="4" fill="#db8c28" />
          </svg>
        </div>
      </div>
    </section>
  );
}
