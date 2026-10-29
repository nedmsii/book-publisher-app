# Implementation note — "Coming soon" placeholders + PDF wiring

First iteration (no `placeholders-review.json` was present).

## Task 1 — "Coming soon" publication-date placeholders

Added two bilingual UI strings to the `bookDetail` section of both dictionaries
(this section is already read by the book card via `dict.bookDetail.*` and by the
book detail page, so it is the shared place both components can reach):

- `dateComingSoon` — EN "Publication date coming soon" / AR "تاريخ النشر قريباً"
- `bookComingSoon` — EN "Full book coming soon" / AR "الكتاب كاملاً قريباً"

Files: `src/i18n/dictionaries/en.ts`, `src/i18n/dictionaries/ar.ts`.
`Dictionary` is `typeof en`, so adding the keys to `en.ts` extends the type and
`ar.ts` (typed `: Dictionary`) is required to match — both were updated.

Year-rendering behavior changed from "hide when 0" to "show coming-soon label":

- `src/components/books/BookCard.tsx` — the year `<p>` previously rendered only
  when `publishedYear > 0`. Now it always renders: the real year when `> 0`,
  otherwise `dict.bookDetail.dateComingSoon`.
- `src/app/[lang]/books/[slug]/page.tsx` — the metadata `<dl>` previously added the
  "Published" row only when `publishedYear > 0`. Now the row is always present:
  real year when `> 0`, otherwise `dict.bookDetail.dateComingSoon`.

Locale number formatting: the existing code renders years as the raw number
(`{book.publishedYear}` / `String(book.publishedYear)`) with no Arabic-Indic
conversion. That behavior was preserved — only the "hidden when 0" logic was
swapped for the coming-soon label. `structured-data.ts` (`datePublished`) was left
unchanged: it still omits the date when the year is 0, which is correct for schema.

## Task 2 — Wire up the 5 existing PDFs; "coming soon" for the other 5

Copied (not moved) the 5 Arabic-named PDFs from `public/PDF_Books/` into
`public/books/` with clean ASCII slug filenames, using `Copy-Item -LiteralPath`.
Originals in `public/PDF_Books/` were left untouched. Created `public/books/`.

Destination files (verified present and > 0 bytes):

| File                                      | Bytes       |
|-------------------------------------------|-------------|
| public/books/diary-of-a-muslim.pdf        | 34,292,987  |
| public/books/my-village-memory-and-longing.pdf | 12,612,625 |
| public/books/in-the-embrace-of-islam.pdf  | 6,785,455   |
| public/books/the-true-promise.pdf         | 2,577,652   |
| public/books/diary-of-time-my-memories.pdf| 910,751     |

The 34 MB `diary-of-a-muslim.pdf` (source: "ابراهيم فواز عراجي يوميات مسلم.pdf",
34,292,987 bytes) matches its source byte-for-byte, so it copied fully.

Total added under `public/books/`: ~57.2 MB of PDF binaries.

`contentUrl` set in `src/data/books.ts` on exactly these 5 books:

- my-village-memory-and-longing → /books/my-village-memory-and-longing.pdf
- the-true-promise → /books/the-true-promise.pdf
- in-the-embrace-of-islam → /books/in-the-embrace-of-islam.pdf
- diary-of-time-my-memories → /books/diary-of-time-my-memories.pdf
- diary-of-a-muslim → /books/diary-of-a-muslim.pdf

`contentUrl` left unset on the other 5 (quran-and-modern-sciences, the-road-to-god,
islamic-masterpieces, history-of-the-araji-family, scientific-miracles-quran-sunnah).

Read/download action (new) in `src/app/[lang]/books/[slug]/page.tsx`, placed right
after the "About This Book" synopsis and before the chapter listing:

- When `contentUrl` is present: a working brand-colored link (`<a>` with
  `target="_blank" rel="noopener noreferrer"`) labeled with `dict.bookDetail.readOnline`.
- When `contentUrl` is absent/empty: a disabled, non-clickable `<span>`
  (`aria-disabled="true"`, `cursor-not-allowed`) labeled `dict.bookDetail.bookComingSoon`.

The existing chapters/`sampleNote` block and the "Inquire" contact link were left in place.

## What a visitor now sees

- Confirmed year + PDF (e.g. my-village, 2014): the real year "2014" in the card and
  in the detail "Published" row, plus a working "Read Online" link to the PDF.
- Year 0 + PDF (e.g. the-true-promise): the "Publication date coming soon" label in
  place of the year (card and detail), plus a working "Read Online" link to the PDF.
- Year 0 + no PDF (e.g. islamic-masterpieces): the "Publication date coming soon"
  label in place of the year, and a disabled "Full book coming soon" action instead
  of a link.

## Verification evidence

- `npx tsc --noEmit` from project root → exit code 0, no type errors.
- All 5 destination PDFs exist in `public/books/` and are > 0 bytes (sizes above).
- `books.ts` has `contentUrl` on exactly the 5 mapped books and none of the other 5
  (confirmed by searching the file for `contentUrl` — 5 matches).

## Note on binaries / git

~57.2 MB of PDFs were added under `public/books/`. `.gitignore` was NOT changed —
the decision about whether to commit these large binaries (or use Git LFS / an
external store) is left to you.
