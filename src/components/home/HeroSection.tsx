import Link from "next/link";
import Image from "next/image";
import type { Dictionary } from "@/i18n";
import { localizedPath, type Locale } from "@/i18n/config";
import { getBooksForDisplay } from "@/data/books";

interface HeroSectionProps {
  lang: Locale;
  dict: Dictionary;
}

export default function HeroSection({ lang, dict }: HeroSectionProps) {
  // Three most recent books (getBooksForDisplay is newest → oldest). The newest
  // sits in front of the fanned stack.
  const recent = getBooksForDisplay().slice(0, 3);
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

        {/* Fanned stack of the three most recent book covers (newest in front) */}
        <div
          className="absolute end-12 top-1/2 -translate-y-1/2 hidden lg:block"
          aria-hidden="true"
        >
          <div className="relative w-[320px] h-[320px]">
            {recent.map((book, i) => {
              // i = 0 is newest. Newest gets the highest z-index so it sits in front.
              const depth = recent.length - 1 - i;
              const offset = i * 44; // horizontal shift per layer, in px
              const rotations = ["-rotate-6", "-rotate-2", "rotate-3"];
              return (
                <div
                  key={book.id}
                  className={`absolute top-0 ${rotations[i] ?? ""} rounded-lg overflow-hidden shadow-2xl ring-1 ring-black/10`}
                  style={{
                    insetInlineEnd: `${offset}px`,
                    zIndex: depth + 1,
                    width: 210,
                    height: 300,
                  }}
                >
                  <Image
                    src={book.coverImage}
                    alt=""
                    width={210}
                    height={300}
                    className="w-full h-full object-cover"
                    priority={i === 0}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
