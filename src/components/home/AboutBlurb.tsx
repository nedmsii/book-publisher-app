import Link from "next/link";
import type { Dictionary } from "@/i18n";
import { localizedPath, type Locale } from "@/i18n/config";

interface AboutBlurbProps {
  lang: Locale;
  dict: Dictionary;
}

export default function AboutBlurb({ lang, dict }: AboutBlurbProps) {
  const stats = [
    { value: "10", label: dict.home.stats.books },
    { value: "30+", label: dict.home.stats.years },
    { value: "6", label: dict.home.stats.genres },
    { value: "∞", label: dict.home.stats.stories },
  ];

  return (
    <section className="py-16 bg-white" aria-labelledby="about-blurb-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <p className="text-brand-600 text-sm font-semibold uppercase tracking-widest mb-2">
              {dict.home.aboutEyebrow}
            </p>
            <h2
              id="about-blurb-heading"
              className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-6"
            >
              {dict.home.aboutHeading}
            </h2>
            <p className="text-ink-600 leading-relaxed mb-4">
              {dict.home.aboutParagraph1}
            </p>
            <p className="text-ink-600 leading-relaxed mb-8">
              {dict.home.aboutParagraph2}
            </p>
            <Link
              href={localizedPath(lang, "/about")}
              className="inline-flex items-center gap-2 border-2 border-brand-600 text-brand-600 hover:bg-brand-600 hover:text-white font-semibold px-6 py-3 rounded transition-colors text-sm"
            >
              {dict.home.readHisStory}
              <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-ink-950 text-white rounded-lg p-6 text-center"
              >
                <div className="font-serif text-4xl font-bold text-brand-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-ink-300 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
