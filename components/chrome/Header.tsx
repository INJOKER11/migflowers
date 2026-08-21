'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { Heart, Menu, ShoppingCart, STROKE, STROKE_HEAVY, User, X } from '@/components/ui/icons';
import { MobileNav } from './MobileNav';
import { NAV_LINKS, isCurrent } from './nav';

export function Header() {
  const pathname = usePathname();
  const { count, ready, openDrawer } = useCart();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => setNavOpen(false), [pathname]);

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
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link"
              aria-current={isCurrent(pathname, link.href) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="icon-btn nav-toggle"
            title="Меню"
            aria-label="Меню"
            aria-expanded={navOpen}
            onClick={() => setNavOpen((open) => !open)}
          >
            {navOpen ? (
              <X size={17} strokeWidth={STROKE_HEAVY} />
            ) : (
              <Menu size={17} strokeWidth={STROKE_HEAVY} />
            )}
          </button>

          <Link href="/wishlist" className="icon-btn" title="Збережене" aria-label="Збережене">
            <Heart size={16} strokeWidth={STROKE} />
          </Link>

          {/*<Link href="/account" className="icon-btn" title="Кабінет" aria-label="Кабінет">*/}
          {/*  <User size={16} strokeWidth={STROKE} />*/}
          {/*</Link>*/}

          <button type="button" className="cart-btn" onClick={openDrawer} aria-label="Кошик">
            <ShoppingCart size={16} strokeWidth={STROKE} />
            <span className="tabular">{ready ? count : 0}</span>
          </button>
        </div>
      </div>

      {navOpen && <MobileNav pathname={pathname} onNavigate={() => setNavOpen(false)} />}
    </header>
  );
}
