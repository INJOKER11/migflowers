/** The seven links, in the header and in the mobile panel alike. */
export const NAV_LINKS = [
  { href: '/', label: 'Головна' },
  { href: '/shop', label: 'Магазин' },
  // { href: '/subscription', label: 'Підписка' },
  { href: '/about', label: 'Про нас' },
  { href: '/delivery', label: 'Доставка' },
  { href: '/blog', label: 'Журнал' },
  { href: '/contact', label: 'Контакти' },
] as const;

export function isCurrent(pathname: string, href: string): boolean {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}
