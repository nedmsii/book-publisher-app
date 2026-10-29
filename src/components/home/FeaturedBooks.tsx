import Link from "next/link";
import BookCard from "@/components/books/BookCard";
import { getFeaturedBooks } from "@/data/books";
import type { Dictionary } from "@/i18n";
import { localizedPath, type Locale } from "@/i18n/config";

interface FeaturedBooksProps {
  lang: Locale;
  dict: Dictionary;
}

export default function FeaturedBooks({ lang, dict }: FeaturedBooksProps) {
  const featured = getFeaturedBooks();

  return (
    <section className="py-16 bg-brand-50" aria-labelledby="featured-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand-600 text-sm font-semibold uppercase tracking-widest mb-2">
              {dict.home.featuredEyebrow}
            </p>
            <h2
              id="featured-heading"
              className="font-serif text-3xl md:text-4xl font-bold text-ink-900"
            >
              {dict.home.featuredHeading}
            </h2>
          </div>
          <Link
            href={localizedPath(lang, "/books")}
            className="hidden sm:inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-semibold text-sm transition-colors"
          >
            {dict.home.viewAllBooks}
            <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featured.map((book, index) => (
            <BookCard key={book.id} book={book} lang={lang} dict={dict} priority={index < 2} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href={localizedPath(lang, "/books")}
            className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-semibold text-sm transition-colors"
          >
            {dict.home.viewAllBooksCount}
            <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
