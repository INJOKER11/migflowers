'use client';

import Image from 'next/image';
import { Link } from '@/components/ui/Link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { Heart, Menu, ShoppingCart, STROKE, STROKE_HEAVY, X } from '@/components/ui/icons';
import type { Dictionary } from '@/lib/dictionaries';
import { stripLocale } from '@/lib/i18n';
import { MobileNav } from './MobileNav';
import { LanguageSwitcher } from './LanguageSwitcher';
import { navLinks, isCurrent } from './nav';

/* Only the two slices the chrome needs. Handing the whole dictionary to a
   client component would serialise every SEO string into the RSC payload. */
export function Header({ nav, chrome }: Pick<Dictionary, 'nav' | 'chrome'>) {
  const pathname = usePathname();
  const { count, ready, openDrawer } = useCart();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => setNavOpen(false), [pathname]);

  /* The nav hrefs are bare, the pathname is not on Russian pages — compare
     them on the same footing. */
  const here = stripLocale(pathname);
  const links = navLinks(nav);

  return (
    <header className="header">
      <div className="header-row">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 'none' }}>
          <Image
            src="/logo.png"
            alt="MIG Flowers"
            width={46}
            height={46}
            priority
            style={{ borderRadius: '50%' }}
          />
          <span className="wordmark">MIG Flowers</span>
        </Link>

        <nav className="desktop-nav">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link"
              aria-current={isCurrent(here, link.href) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
          <LanguageSwitcher label={chrome.switchLabel} switchTo={chrome.switchTo} />
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="icon-btn nav-toggle"
            title={chrome.menu}
            aria-label={chrome.menu}
            aria-expanded={navOpen}
            onClick={() => setNavOpen((open) => !open)}
          >
            {navOpen ? (
              <X size={17} strokeWidth={STROKE_HEAVY} />
            ) : (
              <Menu size={17} strokeWidth={STROKE_HEAVY} />
            )}
          </button>

          <Link
            href="/wishlist"
            className="icon-btn"
            title={chrome.wishlist}
            aria-label={chrome.wishlist}
          >
            <Heart size={16} strokeWidth={STROKE} />
          </Link>

          <button
            type="button"
            className="cart-btn"
            onClick={openDrawer}
            aria-label={chrome.cart}
          >
            <ShoppingCart size={16} strokeWidth={STROKE} />
            <span className="tabular">{ready ? count : 0}</span>
          </button>
        </div>
      </div>

      {navOpen && (
        <MobileNav
          pathname={here}
          links={links}
          dict={chrome}
          onNavigate={() => setNavOpen(false)}
        />
      )}
    </header>
  );
}
