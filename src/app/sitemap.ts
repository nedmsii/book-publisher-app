import { MetadataRoute } from "next";
import { getAllSlugs } from "@/data/books";
import { localizedPath } from "@/i18n/config";

const BASE_URL = process.env.SITE_URL ?? "http://localhost:3000";

interface RouteDef {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}

function abs(path: string): string {
  return `${BASE_URL}${path}`;
}

/**
 * Build both the Arabic (root) and English (/en) sitemap entries for a given
 * locale-agnostic path, each carrying hreflang alternates.
 */
function entriesFor(route: RouteDef): MetadataRoute.Sitemap {
  const arUrl = abs(localizedPath("ar", route.path));
  const enUrl = abs(localizedPath("en", route.path));
  const languages = { ar: arUrl, en: enUrl, "x-default": arUrl };
  const lastModified = new Date();

  return [
    {
      url: arUrl,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: { languages },
    },
    {
      url: enUrl,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: { languages },
    },
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: RouteDef[] = [
    { path: "/", changeFrequency: "weekly", priority: 1.0 },
    { path: "/books", changeFrequency: "weekly", priority: 0.9 },
    { path: "/about", changeFrequency: "monthly", priority: 0.8 },
    { path: "/contact", changeFrequency: "yearly", priority: 0.7 },
    ...getAllSlugs().map((slug) => ({
      path: `/books/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  return routes.flatMap(entriesFor);
}
