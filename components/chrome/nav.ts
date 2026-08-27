import type { Dictionary } from '@/lib/dictionaries';

/** The six links, in the header and in the mobile panel alike. The hrefs are
    bare — `components/ui/Link` adds the locale prefix. */
export function navLinks(nav: Dictionary['nav']) {
  return [
    { href: '/', label: nav.home },
    { href: '/shop', label: nav.shop },
    // { href: '/subscription', label: … },
    { href: '/about', label: nav.about },
    { href: '/delivery', label: nav.delivery },
    { href: '/blog', label: nav.blog },
    { href: '/contact', label: nav.contact },
  ];
}

/** `pathname` carries the locale prefix on Russian pages, `href` never does —
    so compare on the bare path. */
export function isCurrent(pathname: string, href: string): boolean {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}
