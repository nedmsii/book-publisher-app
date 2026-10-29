import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BookGrid from "@/components/books/BookGrid";
import { getBooksForDisplay } from "@/data/books";
import { collectionPageSchema, jsonLdScript } from "@/lib/structured-data";
import { getDictionary } from "@/i18n";
import { isLocale, localizedPath, type Locale } from "@/i18n/config";
import { buildAlternates, openGraphLocales } from "@/i18n/metadata";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  if (!isLocale(params.lang)) return {};
  const dict = getDictionary(params.lang);
  const og = openGraphLocales(params.lang);
  return {
    title: dict.books.heading,
    description: dict.books.intro,
    alternates: buildAlternates(params.lang, "/books"),
    openGraph: {
      title: `${dict.books.heading} — ${dict.meta.authorName}`,
      description: dict.books.intro,
      url: localizedPath(params.lang, "/books"),
      type: "website",
      locale: og.locale,
      alternateLocale: og.alternateLocale,
    },
    twitter: {
      card: "summary_large_image",
      title: `${dict.books.heading} — ${dict.meta.authorName}`,
      description: dict.books.intro,
    },
  };
}

export default function BooksPage({ params }: { params: { lang: string } }) {
  if (!isLocale(params.lang)) notFound();
  const lang: Locale = params.lang;
  const dict = getDictionary(lang);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(collectionPageSchema(lang)) }}
      />

      {/* Page Header */}
      <div className="bg-ink-950 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-2">
            {dict.books.eyebrow}
          </p>
          <h1 className="font-serif text-3xl md:text-5xl font-bold">{dict.books.heading}</h1>
          <p className="text-ink-300 mt-3 text-lg max-w-2xl">{dict.books.intro}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BookGrid books={getBooksForDisplay()} lang={lang} dict={dict} />
      </div>
    </>
  );
}
