import Link from "next/link";
import { fontVariables } from "./fonts";
import { getDictionary } from "@/i18n";
import { defaultLocale, htmlDir, localizedPath } from "@/i18n/config";
import "./globals.css";

/**
 * Global 404 fallback. The root layout is a pass-through, so this renders its
 * own <html>/<body>. Uses the default locale (Arabic).
 */
export default function NotFound() {
  const lang = defaultLocale;
  const dict = getDictionary(lang);

  return (
    <html lang={lang} dir={htmlDir[lang]} className={fontVariables}>
      <body className="font-sans bg-white text-ink-900 antialiased">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <p className="font-serif text-8xl font-bold text-brand-200 mb-4" aria-hidden="true">
              404
            </p>
            <h1 className="font-serif text-2xl font-bold text-ink-900 mb-3">
              {dict.notFound.heading}
            </h1>
            <p className="text-ink-500 mb-8 leading-relaxed">{dict.notFound.body}</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href={localizedPath(lang, "/")}
                className="bg-brand-600 hover:bg-brand-500 text-white font-semibold px-6 py-2.5 rounded transition-colors text-sm"
              >
                {dict.notFound.goHome}
              </Link>
              <Link
                href={localizedPath(lang, "/books")}
                className="border border-ink-200 hover:border-brand-400 text-ink-600 hover:text-brand-600 font-semibold px-6 py-2.5 rounded transition-colors text-sm"
              >
                {dict.notFound.browseBooks}
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
