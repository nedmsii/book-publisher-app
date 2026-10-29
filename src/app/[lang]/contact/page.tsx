import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContactForm from "@/components/contact/ContactForm";
import FAQSection from "@/components/contact/FAQSection";
import Breadcrumb from "@/components/layout/Breadcrumb";
import {
  contactPageSchema,
  faqSchema,
  jsonLdScript,
} from "@/lib/structured-data";
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
    title: dict.contact.heading,
    description: dict.contact.intro,
    alternates: buildAlternates(params.lang, "/contact"),
    openGraph: {
      title: dict.contact.heading,
      description: dict.contact.intro,
      url: localizedPath(params.lang, "/contact"),
      type: "website",
      locale: og.locale,
      alternateLocale: og.alternateLocale,
    },
    twitter: {
      card: "summary",
      title: dict.contact.heading,
      description: dict.contact.intro,
    },
  };
}

export default function ContactPage({ params }: { params: { lang: string } }) {
  if (!isLocale(params.lang)) notFound();
  const lang: Locale = params.lang;
  const dict = getDictionary(lang);
  const faqs = dict.contact.faqs;

  const breadcrumbs = [
    { label: dict.breadcrumb.home, href: localizedPath(lang, "/") },
    { label: dict.breadcrumb.contact, href: localizedPath(lang, "/contact") },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(contactPageSchema(lang)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(faqSchema([...faqs], lang)) }}
      />

      {/* Page Header */}
      <div className="bg-ink-950 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-2">
            {dict.contact.eyebrow}
          </p>
          <h1 className="font-serif text-3xl md:text-5xl font-bold">{dict.contact.heading}</h1>
          <p className="text-ink-300 mt-3 text-lg max-w-xl">{dict.contact.intro}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumb items={breadcrumbs} lang={lang} ariaLabel={dict.breadcrumb.label} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-ink-100 rounded-xl p-6 md:p-8 shadow-sm mb-10">
              <h2 className="font-serif text-xl font-bold text-ink-900 mb-6">
                {dict.contact.sendMessage}
              </h2>
              <ContactForm dict={dict} />
            </div>

            <FAQSection faqs={[...faqs]} heading={dict.contact.faqHeading} />
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-ink-950 text-white rounded-xl p-6 mb-6">
              <h2 className="font-serif text-lg font-bold mb-4">{dict.contact.contactDetails}</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-brand-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-ink-400 text-xs uppercase tracking-wide mb-1">{dict.contact.email}</p>
                    <a
                      href="mailto:bonahid@araji.com"
                      className="text-brand-400 hover:text-brand-300 text-sm transition-colors"
                    >
                      bonahid@araji.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-brand-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-ink-400 text-xs uppercase tracking-wide mb-1">{dict.contact.responseTime}</p>
                    <p className="text-ink-200 text-sm">{dict.contact.responseTimeValue}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-brand-50 border border-brand-100 rounded-xl p-6">
              <h2 className="font-serif text-base font-bold text-ink-900 mb-2">
                {dict.contact.sidebarHeading}
              </h2>
              <p className="text-ink-500 text-sm mb-4 leading-relaxed">{dict.contact.sidebarBody}</p>
              <a
                href={localizedPath(lang, "/books")}
                className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-semibold text-sm transition-colors"
              >
                {dict.contact.viewAllBooks}
                <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
