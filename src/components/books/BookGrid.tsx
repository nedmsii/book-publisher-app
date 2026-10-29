"use client";

import { useState, useMemo } from "react";
import BookCard from "./BookCard";
import { Book } from "@/types";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";

interface BookGridProps {
  books: Book[];
  lang: Locale;
  dict: Dictionary;
}

const ALL_GENRES = "__all__";

export default function BookGrid({ books, lang, dict }: BookGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(ALL_GENRES);

  // Options keyed by the canonical English genre, labelled in the active locale.
  const genreOptions = useMemo(() => {
    const unique = Array.from(new Set(books.map((b) => b.genre)));
    return unique.map((genre) => {
      const book = books.find((b) => b.genre === genre);
      return { value: genre, label: book ? book.genreLabel[lang] : genre };
    });
  }, [books, lang]);

  const filtered = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return books.filter((book) => {
      const matchesSearch =
        query === "" ||
        book.title[lang].toLowerCase().includes(query) ||
        book.genreLabel[lang].toLowerCase().includes(query) ||
        book.synopsis[lang].toLowerCase().includes(query);

      const matchesGenre =
        selectedGenre === ALL_GENRES || book.genre === selectedGenre;

      return matchesSearch && matchesGenre;
    });
  }, [books, searchQuery, selectedGenre, lang]);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <label htmlFor="search-books" className="sr-only">
            {dict.books.searchLabel}
          </label>
          <div className="relative">
            <svg
              className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              id="search-books"
              type="search"
              placeholder={dict.books.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full ps-10 pe-4 py-2.5 border border-ink-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="filter-genre" className="sr-only">
            {dict.books.filterGenreLabel}
          </label>
          <select
            id="filter-genre"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="w-full sm:w-48 px-3 py-2.5 border border-ink-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white"
          >
            <option value={ALL_GENRES}>{dict.books.allGenres}</option>
            {genreOptions.map((genre) => (
              <option key={genre.value} value={genre.value}>
                {genre.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-ink-400 mb-6" aria-live="polite">
        {filtered.length === books.length
          ? dict.books.showingAll(books.length)
          : dict.books.showingSome(filtered.length, books.length)}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filtered.map((book, index) => (
            <BookCard key={book.id} book={book} lang={lang} dict={dict} priority={index < 4} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-ink-400 text-lg mb-4">{dict.books.noResults}</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedGenre(ALL_GENRES);
            }}
            className="text-brand-600 hover:text-brand-700 font-semibold text-sm transition-colors"
          >
            {dict.books.clearFilters}
          </button>
        </div>
      )}
    </div>
  );
}
