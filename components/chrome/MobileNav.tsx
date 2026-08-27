'use client';

import { Link } from '@/components/ui/Link';
import { isCurrent } from './nav';

interface MobileNavProps {
  /** Already stripped of the locale prefix by `Header`. */
  pathname: string;
  links: { href: string; label: string }[];
  onNavigate: () => void;
}

export function MobileNav({ pathname, links, onNavigate }: MobileNavProps) {
  return (
    <div className="mobile-nav">
      {links.map((link) => (
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
