import Link from "next/link";
import Image from "next/image";
import { Book } from "@/types";
import type { Dictionary } from "@/i18n";
import { localizedPath, type Locale } from "@/i18n/config";

interface BookCardProps {
  book: Book;
  lang: Locale;
  dict: Dictionary;
  priority?: boolean;
}

export default function BookCard({ book, lang, dict, priority = false }: BookCardProps) {
  const href = localizedPath(lang, `/books/${book.slug}`);
  const title = book.title[lang];
  const coverAlt = dict.bookDetail.coverAlt(title, book.author[lang]);

  return (
    <article className="group bg-white rounded-lg overflow-hidden shadow-sm border border-ink-100 hover:shadow-md transition-shadow">
      <Link href={href} className="block" tabIndex={-1} aria-hidden="true">
        <div className="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-brand-100 to-brand-200">
          {/* Placeholder behind image (shows if cover image is missing) */}
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <div className="text-center p-4">
              <svg className="w-12 h-12 mx-auto text-brand-600 opacity-40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
              </svg>
            </div>
          </div>
          <Image
            src={book.coverImage}
            alt={coverAlt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Genre badge */}
          <div className="absolute top-2 start-2">
            <span className="bg-ink-950/80 text-white text-xs px-2 py-1 rounded font-medium backdrop-blur-sm">
              {book.genreLabel[lang]}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <p className="text-xs text-ink-400 mb-1">
          {book.publishedYear > 0 ? book.publishedYear : dict.bookDetail.dateComingSoon}
        </p>
        <h3 className="font-serif font-bold text-ink-900 text-base leading-tight mb-1">
          <Link href={href} className="hover:text-brand-600 transition-colors">
            {title}
          </Link>
        </h3>
        <p className="text-sm text-ink-500 mb-3">{book.author[lang]}</p>
        <p className="text-xs text-ink-500 leading-relaxed line-clamp-3 mb-4">
          {book.synopsis[lang]}
        </p>
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 text-sm font-semibold transition-colors"
          aria-label={dict.books.readMoreAria(title)}
        >
          {dict.books.readMore}
          <svg className="w-3 h-3 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
