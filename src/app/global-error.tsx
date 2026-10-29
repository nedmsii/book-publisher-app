"use client";

import { useEffect } from "react";
import { fontVariables } from "./fonts";
import { getDictionary } from "@/i18n";
import { defaultLocale, htmlDir } from "@/i18n/config";
import "./globals.css";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const lang = defaultLocale;
  const dict = getDictionary(lang);

  return (
    <html lang={lang} dir={htmlDir[lang]} className={fontVariables}>
      <body className="font-sans bg-white text-ink-900 antialiased">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <p className="font-serif text-6xl font-bold text-red-100 mb-4" aria-hidden="true">
              500
            </p>
            <h2 className="font-serif text-2xl font-bold text-ink-900 mb-3">
              {dict.error.heading}
            </h2>
            <p className="text-ink-500 mb-8">{dict.error.body}</p>
            <button
              onClick={reset}
              className="bg-brand-600 hover:bg-brand-500 text-white font-semibold px-6 py-2.5 rounded transition-colors text-sm"
            >
              {dict.error.tryAgain}
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
