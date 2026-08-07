'use client';

import Link from 'next/link';
import { NAV_LINKS, isCurrent } from './nav';

interface MobileNavProps {
  pathname: string;
  onNavigate: () => void;
}

export function MobileNav({ pathname, onNavigate }: MobileNavProps) {
  return (
    <div className="mobile-nav">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onNavigate}
          aria-current={isCurrent(pathname, link.href) ? 'page' : undefined}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
