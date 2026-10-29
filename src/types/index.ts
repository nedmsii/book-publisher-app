export interface LocalizedString {
  ar: string;
  en: string;
}

export interface Book {
  id: string;
  slug: string;
  title: LocalizedString;
  author: LocalizedString;
  synopsis: LocalizedString;
  coverImage: string;
  publishedYear: number;
  /** Canonical English genre key, used for filtering and schema. */
  genre: string;
  genreLabel: LocalizedString;
  isbn?: string;
  contentUrl?: string;
  featured: boolean;
  sortOrder: number;
  chapters?: Chapter[];
}

export interface Chapter {
  id: string;
  number: number;
  title: LocalizedString;
  excerpt: LocalizedString;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
  honeypot?: string;
}

export interface ApiResponse<T = null> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string>;
}
