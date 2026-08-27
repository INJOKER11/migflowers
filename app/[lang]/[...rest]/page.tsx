import { notFound } from 'next/navigation';

/**
 * The 404 for URLs that match no route at all.
 *
 * Without it, an unmatched path falls past `[lang]` entirely and Next serves
 * its own bare English "This page could not be found". Catching it here gets
 * `app/[lang]/not-found.tsx` back — the Ukrainian (or Russian) page, with the
 * locale's brand title.
 *
 * It renders in Next's error shell rather than inside the layout, so there is
 * no header or footer on it — the same as every other `notFound()` in this app,
 * including the five retired routes. The alternative was rendering the 404 body
 * as an ordinary page, which would look better and answer HTTP 200: a soft 404,
 * and worse for search than a plain one.
 *
 * Next matches a concrete route over a catch-all, so this only runs when
 * nothing else did. (`global-not-found.tsx` is the other way to solve this, but
 * it is still experimental and needs a config flag.)
 */
export default function CatchAll() {
  notFound();
}
