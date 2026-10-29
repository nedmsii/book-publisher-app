/**
 * Root layout (pass-through).
 *
 * The real <html>/<body> shell is rendered by the locale layout at
 * src/app/[lang]/layout.tsx (so it can set lang/dir per locale), and by the
 * not-found.tsx / global-error.tsx boundaries which render their own shell.
 * Next.js App Router requires a root layout to exist; this one simply forwards
 * its children so the locale tree and the top-level 404/500 boundaries each
 * own their document shell.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
