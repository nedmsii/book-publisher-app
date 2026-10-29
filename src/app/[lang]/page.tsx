import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import HeroSection from "@/components/home/HeroSection";
import FeaturedBooks from "@/components/home/FeaturedBooks";
import AboutBlurb from "@/components/home/AboutBlurb";
import { websiteSchema, organizationSchema, jsonLdScript } from "@/lib/structured-data";
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
    title: dict.meta.siteName,
    description: dict.home.heroBody,
    alternates: buildAlternates(params.lang, "/"),
    openGraph: {
      title: dict.meta.siteName,
      description: dict.home.heroBody,
      url: localizedPath(params.lang, "/"),
      type: "website",
      locale: og.locale,
      alternateLocale: og.alternateLocale,
    },
  };
}

export default function HomePage({ params }: { params: { lang: string } }) {
  if (!isLocale(params.lang)) notFound();
  const lang: Locale = params.lang;
  const dict = getDictionary(lang);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(websiteSchema(lang)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationSchema(lang)) }}
      />

      <HeroSection lang={lang} dict={dict} />
      <FeaturedBooks lang={lang} dict={dict} />
      <AboutBlurb lang={lang} dict={dict} />

      {/* Contact CTA */}
      <section className="py-16 bg-brand-600" aria-labelledby="cta-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            id="cta-heading"
            className="font-serif text-3xl md:text-4xl font-bold text-white mb-4"
          >
            {dict.home.ctaHeading}
          </h2>
          <p className="text-brand-100 text-lg mb-8 leading-relaxed">
            {dict.home.ctaBody}
          </p>
          <Link
            href={localizedPath(lang, "/contact")}
            className="inline-flex items-center gap-2 bg-white text-brand-700 hover:bg-brand-50 font-semibold px-8 py-3 rounded transition-colors"
          >
            {dict.home.ctaButton}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
