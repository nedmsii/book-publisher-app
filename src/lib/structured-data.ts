import { Book, FAQ, BreadcrumbItem } from "@/types";
import { getDictionary } from "@/i18n";
import { localizedPath, type Locale } from "@/i18n/config";

const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";
const PUBLISHER_EMAIL = "bonahid@araji.com";

function absolute(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path}`;
}

export function websiteSchema(lang: Locale) {
  const dict = getDictionary(lang);
  const url = absolute(localizedPath(lang, "/"));
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: dict.meta.siteName,
    url,
    description: dict.home.heroBody,
    inLanguage: lang,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absolute(localizedPath(lang, "/books"))}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationSchema(lang: Locale) {
  const dict = getDictionary(lang);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: dict.meta.authorName,
    url: absolute(localizedPath(lang, "/")),
    email: PUBLISHER_EMAIL,
    inLanguage: lang,
    founder: {
      "@type": "Person",
      name: dict.meta.authorName,
    },
    sameAs: [],
  };
}

export function personSchema(lang: Locale) {
  const dict = getDictionary(lang);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: dict.meta.authorName,
    jobTitle: dict.meta.tagline,
    email: PUBLISHER_EMAIL,
    url: absolute(localizedPath(lang, "/about")),
    description: dict.home.aboutParagraph1,
    inLanguage: lang,
    knowsAbout:
      lang === "ar"
        ? [
            "علوم القرآن الكريم",
            "الإعجاز العلمي في القرآن والسنة",
            "الفكر الإسلامي",
            "التربية الإسلامية",
            "الأدب العربي",
            "التراث العربي",
          ]
        : [
            "Qur'anic Sciences",
            "Scientific Miracles in the Qur'an and Sunnah",
            "Islamic Thought",
            "Islamic Education",
            "Arabic Literature",
            "Arab Heritage",
          ],
  };
}

export function bookSchema(book: Book, lang: Locale) {
  const dict = getDictionary(lang);
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title[lang],
    author: {
      "@type": "Person",
      name: book.author[lang],
    },
    description: book.synopsis[lang],
    ...(book.isbn ? { isbn: book.isbn } : {}),
    ...(book.publishedYear > 0 ? { datePublished: String(book.publishedYear) } : {}),
    genre: book.genreLabel[lang],
    publisher: {
      "@type": "Organization",
      name: dict.meta.authorName,
    },
    url: absolute(localizedPath(lang, `/books/${book.slug}`)),
    image: `${SITE_URL}${book.coverImage}`,
    inLanguage: lang,
  };
}

export function contactPageSchema(lang: Locale) {
  const dict = getDictionary(lang);
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: dict.contact.heading,
    url: absolute(localizedPath(lang, "/contact")),
    description: dict.contact.intro,
    inLanguage: lang,
    mainEntity: {
      "@type": "Person",
      name: dict.meta.authorName,
      email: PUBLISHER_EMAIL,
    },
  };
}

export function faqSchema(faqs: FAQ[], lang: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[], lang: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    inLanguage: lang,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absolute(item.href),
    })),
  };
}

export function collectionPageSchema(lang: Locale) {
  const dict = getDictionary(lang);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: dict.books.heading,
    description: dict.books.intro,
    url: absolute(localizedPath(lang, "/books")),
    inLanguage: lang,
    author: {
      "@type": "Person",
      name: dict.meta.authorName,
    },
  };
}

export function jsonLdScript(schema: object): string {
  return JSON.stringify(schema);
}
