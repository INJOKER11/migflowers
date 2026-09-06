'use client';

import { createContext, useContext } from 'react';
import type { UiDictionary } from './dictionaries';

/**
 * The interface strings, for client components.
 *
 * Server components read `getDictionary(locale)` directly. Client ones sit
 * anywhere from the header to a stepper button four levels inside the cart
 * drawer, and threading a dictionary slice through every one of them as a prop
 * is more plumbing than it is worth — so the layout seeds this once, next to
 * `CartProvider`, and `useDict()` reads it.
 *
 * Only `UiDictionary` goes in: the SEO strings are server-side, and putting
 * them here would ship every title and description in each page's RSC payload.
 */
const DictionaryContext = createContext<UiDictionary | null>(null);

export function DictionaryProvider({
  dict,
  children,
}: {
  dict: UiDictionary;
  children: React.ReactNode;
}) {
  return <DictionaryContext.Provider value={dict}>{children}</DictionaryContext.Provider>;
}

export function useDict(): UiDictionary {
  const dict = useContext(DictionaryContext);
  if (!dict) throw new Error('useDict must be used inside <DictionaryProvider>');
  return dict;
}
