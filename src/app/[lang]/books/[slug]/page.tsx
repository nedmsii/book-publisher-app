import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import BookCard from "@/components/books/BookCard";
import SocialShare from "@/components/books/SocialShare";
import { getBookBySlug, getRelatedBooks, getAllSlugs } from "@/data/books";
import { bookSchema, jsonLdScript } from "@/lib/structured-data";
import { getDictionary } from "@/i18n";
import { isLocale, locales, localizedPath, type Locale } from "@/i18n/config";
import { buildAlternates, openGraphLocales } from "@/i18n/metadata";

interface Props {
  params: { lang: string; slug: string };
}

export function generateStaticParams() {
  const slugs = getAllSlugs();
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.lang)) return {};
  const book = getBookBySlug(params.slug);
  if (!book) return {};
  const lang = params.lang;
  const title = book.title[lang];
  const synopsis = book.synopsis[lang];
  const og = openGraphLocales(lang);

  return {
    title,
    description: synopsis.slice(0, 160),
    alternates: buildAlternates(lang, `/books/${book.slug}`),
    openGraph: {
      title: `${title} — ${book.author[lang]}`,
      description: synopsis.slice(0, 160),
      url: localizedPath(lang, `/books/${book.slug}`),
      type: "book",
      locale: og.locale,
      alternateLocale: og.alternateLocale,
      images: [
        {
          url: book.coverImage,
          width: 400,
          height: 600,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${book.author[lang]}`,
      description: synopsis.slice(0, 160),
      images: [book.coverImage],
    },
  };
}

export default function BookDetailPage({ params }: Props) {
  if (!isLocale(params.lang)) notFound();
  const lang: Locale = params.lang;
  const dict = getDictionary(lang);
  const book = getBookBySlug(params.slug);
  if (!book) notFound();

  const related = getRelatedBooks(book.slug, book.genre);
  const title = book.title[lang];
  const author = book.author[lang];
  const genreLabel = book.genreLabel[lang];

  const breadcrumbs = [
    { label: dict.breadcrumb.home, href: localizedPath(lang, "/") },
    { label: dict.breadcrumb.books, href: localizedPath(lang, "/books") },
    { label: title, href: localizedPath(lang, `/books/${book.slug}`) },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(bookSchema(book, lang)) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumb items={breadcrumbs} lang={lang} ariaLabel={dict.breadcrumb.label} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Book cover */}
          <aside className="lg:col-span-1">
            <div className="relative aspect-[2/3] bg-ink-100 rounded-lg overflow-hidden shadow-lg max-w-xs mx-auto lg:max-w-none">
              <Image
                src={book.coverImage}
                alt={dict.bookDetail.coverAlt(title, author)}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 300px, 350px"
              />
              {/* Placeholder gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-100 to-brand-300 -z-10 flex items-center justify-center">
                <div className="text-center p-8">
                  <p className="font-serif text-brand-800 text-xl font-bold">{title}</p>
                  <p className="text-brand-600 text-sm mt-2">{author}</p>
                </div>
              </div>
            </div>

            {/* Book metadata */}
            <div className="mt-6 bg-ink-50 rounded-lg p-4 space-y-3">
              <dl>
                {[
                  { term: dict.bookDetail.fields.author, def: author },
                  { term: dict.bookDetail.fields.genre, def: genreLabel },
                  ...(book.publishedYear > 0
                    ? [{ term: dict.bookDetail.fields.published, def: String(book.publishedYear) }]
                    : []),
                  ...(book.isbn ? [{ term: dict.bookDetail.fields.isbn, def: book.isbn }] : []),
                ].map(({ term, def }) => (
                  <div key={term} className="flex items-start gap-2 py-1.5 border-b border-ink-100 last:border-0">
                    <dt className="text-xs text-ink-400 w-20 shrink-0 pt-0.5">{term}</dt>
                    <dd className="text-sm text-ink-700 font-medium">{def}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-6">
              <SocialShare
                shareTitle={`${title} ${dict.books.by} ${author}`}
                shareLabel={dict.bookDetail.share}
                shareOn={dict.bookDetail.shareOn}
              />
            </div>
          </aside>

          {/* Book content */}
          <div className="lg:col-span-2">
            <span className="inline-block bg-brand-100 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              {genreLabel}
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-2 leading-tight">
              {title}
            </h1>
            <p className="text-ink-500 text-lg mb-6">{dict.books.by} {author}</p>

            <div className="prose prose-ink max-w-none mb-8">
              <h2 className="font-serif text-xl font-bold text-ink-800 mb-3">{dict.bookDetail.aboutThisBook}</h2>
              <p className="text-ink-600 leading-relaxed text-lg">{book.synopsis[lang]}</p>
            </div>

            {/* Chapter listing */}
            {book.chapters && book.chapters.length > 0 && (
              <section aria-labelledby="chapters-heading">
                <h2
                  id="chapters-heading"
                  className="font-serif text-xl font-bold text-ink-800 mb-4 flex items-center gap-2"
                >
                  <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {dict.bookDetail.readOnline}
                </h2>
                <div className="space-y-4">
                  {book.chapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      className="bg-brand-50 border border-brand-100 rounded-lg p-5"
                    >
                      <div className="flex items-start gap-4">
                        <span className="font-serif text-2xl font-bold text-brand-300 leading-none mt-1">
                          {String(chapter.number).padStart(2, "0")}
                        </span>
                        <div>
                          <h3 className="font-serif font-bold text-ink-800 text-base mb-2">
                            {chapter.title[lang]}
                          </h3>
                          <p className="text-ink-500 text-sm leading-relaxed italic">
                            &ldquo;{chapter.excerpt[lang]}&rdquo;
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-ink-400 mt-4 italic">{dict.bookDetail.sampleNote}</p>
              </section>
            )}

            <div className="mt-8 pt-6 border-t border-ink-100">
              <Link
                href={localizedPath(lang, "/contact")}
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold px-6 py-3 rounded transition-colors"
              >
                {dict.bookDetail.inquire}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Related books */}
        {related.length > 0 && (
          <section aria-labelledby="related-heading" className="mt-16 pt-10 border-t border-ink-100">
            <h2
              id="related-heading"
              className="font-serif text-2xl font-bold text-ink-900 mb-8"
            >
              {dict.bookDetail.moreIn(genreLabel)}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {related.map((b) => (
                <BookCard key={b.id} book={b} lang={lang} dict={dict} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
