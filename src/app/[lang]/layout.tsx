import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { fontVariables } from "../fonts";
import { getDictionary } from "@/i18n";
import { isLocale, htmlDir, locales, type Locale } from "@/i18n/config";
import { buildAlternates, openGraphLocales, siteUrl } from "@/i18n/metadata";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  if (!isLocale(params.lang)) return {};
  const lang = params.lang;
  const dict = getDictionary(lang);
  const og = openGraphLocales(lang);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: dict.meta.siteName,
      template: `%s | ${dict.meta.authorName}`,
    },
    description: dict.home.heroBody,
    alternates: buildAlternates(lang, "/"),
    authors: [{ name: dict.meta.authorName }],
    creator: dict.meta.authorName,
    publisher: dict.meta.authorName,
    openGraph: {
      type: "website",
      locale: og.locale,
      alternateLocale: og.alternateLocale,
      siteName: dict.meta.siteName,
      title: dict.meta.siteName,
      description: dict.home.heroBody,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  if (!isLocale(params.lang)) notFound();
  const lang: Locale = params.lang;
  const dict = getDictionary(lang);

  return (
    <html lang={lang} dir={htmlDir[lang]} className={fontVariables}>
      <body className="font-sans flex flex-col min-h-screen bg-white text-ink-900 antialiased">
        <Header lang={lang} dict={dict} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer lang={lang} dict={dict} />
      </body>
    </html>
  );
}
