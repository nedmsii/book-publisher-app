import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { personSchema, organizationSchema, jsonLdScript } from "@/lib/structured-data";
import Breadcrumb from "@/components/layout/Breadcrumb";
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
    title: dict.about.heading,
    description: dict.about.bio[0].slice(0, 160),
    alternates: buildAlternates(params.lang, "/about"),
    openGraph: {
      title: dict.about.heading,
      description: dict.about.bio[0].slice(0, 160),
      url: localizedPath(params.lang, "/about"),
      type: "profile",
      locale: og.locale,
      alternateLocale: og.alternateLocale,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.about.heading,
      description: dict.about.bio[0].slice(0, 160),
    },
  };
}

export default function AboutPage({ params }: { params: { lang: string } }) {
  if (!isLocale(params.lang)) notFound();
  const lang: Locale = params.lang;
  const dict = getDictionary(lang);

  const breadcrumbs = [
    { label: dict.breadcrumb.home, href: localizedPath(lang, "/") },
    { label: dict.breadcrumb.about, href: localizedPath(lang, "/about") },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(personSchema(lang)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationSchema(lang)) }}
      />

      {/* Page Header */}
      <div className="bg-ink-950 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-2">
            {dict.about.eyebrow}
          </p>
          <h1 className="font-serif text-3xl md:text-5xl font-bold">{dict.about.heading}</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumb items={breadcrumbs} lang={lang} ariaLabel={dict.breadcrumb.label} />

        {/* Bio section */}
        <section
          aria-labelledby="bio-heading"
          className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16"
        >
          {/* Author portrait */}
          <div className="lg:col-span-1">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg bg-ink-100">
              <Image
                src="/images/publisher/Ibrahim_Araji_2.jpeg"
                alt={`${dict.about.photoName} — ${dict.about.photoRole}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover object-top"
              />
            </div>
            <p className="text-center text-ink-500 text-sm mt-3 font-serif">
              {dict.about.photoName}
              <span className="block text-ink-400 text-xs mt-0.5">{dict.about.photoRole}</span>
            </p>

            <div className="mt-6 bg-ink-50 rounded-lg p-4">
              <h2 className="font-semibold text-ink-800 text-sm mb-3">{dict.about.contactLabel}</h2>
              <a
                href="mailto:bonahid@araji.com"
                className="text-brand-600 hover:text-brand-700 text-sm transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                bonahid@araji.com
              </a>
            </div>
          </div>

          {/* Bio text */}
          <div className="lg:col-span-2">
            <h2
              id="bio-heading"
              className="font-serif text-2xl md:text-3xl font-bold text-ink-900 mb-6"
            >
              {dict.about.bioHeading}
            </h2>

            <div className="space-y-5 text-ink-600 leading-relaxed">
              {dict.about.bio.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section aria-labelledby="timeline-heading" className="mb-16">
          <h2
            id="timeline-heading"
            className="font-serif text-2xl md:text-3xl font-bold text-ink-900 mb-8"
          >
            {dict.about.milestonesHeading}
          </h2>
          <div className="relative">
            <div className="absolute start-4 top-0 bottom-0 w-px bg-brand-200" aria-hidden="true" />
            <ol className="space-y-6">
              {dict.about.milestones.map((m) => (
                <li key={m.year} className="flex gap-6 ps-12 relative">
                  <div
                    className="absolute start-0 w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    aria-hidden="true"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                    </svg>
                  </div>
                  <div>
                    <span className="inline-block bg-brand-100 text-brand-700 text-xs font-bold px-2 py-0.5 rounded mb-1">
                      {m.year}
                    </span>
                    <p className="text-ink-600 text-sm leading-relaxed">{m.event}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-brand-50 border border-brand-100 rounded-xl p-8 text-center">
          <h2 className="font-serif text-2xl font-bold text-ink-900 mb-3">{dict.about.ctaHeading}</h2>
          <p className="text-ink-500 mb-6 max-w-xl mx-auto">{dict.about.ctaBody}</p>
          <Link
            href={localizedPath(lang, "/contact")}
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold px-8 py-3 rounded transition-colors"
          >
            {dict.about.ctaButton}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </Link>
        </section>
      </div>
    </>
  );
}
