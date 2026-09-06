import Image from 'next/image';
import { Link } from '@/components/ui/Link';
import { SHOP_DETAILS, shopLocation } from '@/lib/content';
import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n';
import { Facebook, Instagram, STROKE, Send } from '@/components/ui/icons';

export function Footer({ dict: t, locale }: { dict: Dictionary['footer']; locale: Locale }) {
  const shop = shopLocation(locale);

  const shopLinks = [
    { href: '/shop', label: t.allFlowers },
    // { href: '/category/wedding-flowers', label: … },
    // { href: '/subscription', label: … },
    // { href: '/gift-cards', label: … },
    // { href: '/corporate', label: t.corporate },
  ];

  const helpLinks = [
    { href: '/delivery', label: t.delivery },
    { href: '/faq', label: t.faq },
    { href: '/reviews', label: t.reviews },
    // { href: '/account', label: … },
    { href: '/contact', label: t.contact },
  ];

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Image
              src="/logo.png"
              alt="MIG Flowers"
              width={52}
              height={52}
              style={{ borderRadius: '50%' }}
            />
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 18,
                letterSpacing: '.16em',
                textTransform: 'uppercase',
                color: '#fff',
              }}
            >
              MIG Flowers
            </span>
          </div>
          <p
            style={{
              margin: '20px 0 0',
              fontSize: 13.5,
              lineHeight: 1.8,
              color: 'var(--color-neutral-400)',
              maxWidth: '34ch',
            }}
          >
            {t.blurb}
          </p>
        </div>

        <div>
          <div className="footer-heading">{t.shop}</div>
          <div className="footer-col">
            {shopLinks.map((link) => (
              <Link key={link.href} href={link.href} className="footer-link">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="footer-heading">{t.help}</div>
          <div className="footer-col">
            {helpLinks.map((link) => (
              <Link key={link.href} href={link.href} className="footer-link">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="footer-heading">{t.where}</div>
          <div className="footer-col">
            <span>{shop.addressShort}</span>
            <a href={SHOP_DETAILS.phoneHref} className="footer-link">
              {SHOP_DETAILS.phone}
            </a>
            {/*<a href={`mailto:${SHOP_DETAILS.email}`} className="footer-link">*/}
            {/*  {SHOP_DETAILS.email}*/}
            {/*</a>*/}
            <span>{shop.hours}</span>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
            <Link
              href="https://www.instagram.com/migflowers__/"
              target="_blank"
              className="social-btn"
              title="Instagram"
              aria-label="Instagram"
            >
              <Instagram size={15} strokeWidth={STROKE} />
            </Link>
            {/*<Link href="/contact" className="social-btn" title="Facebook" aria-label="Facebook">*/}
            {/*  <Facebook size={15} strokeWidth={STROKE} />*/}
            {/*</Link>*/}
            <Link href="/contact" className="social-btn" title="Telegram" aria-label="Telegram">
              <Send size={15} strokeWidth={STROKE} />
            </Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>{t.rights}</span>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <Link href="/legal/privacy">{t.privacy}</Link>
          <Link href="/legal/terms">{t.terms}</Link>
        </div>
      </div>
    </footer>
  );
}
