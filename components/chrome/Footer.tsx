import Image from 'next/image';
import Link from 'next/link';
import { SHOP_DETAILS } from '@/lib/content';
import { Facebook, Instagram, STROKE, Send } from '@/components/ui/icons';

const SHOP_LINKS = [
  { href: '/shop', label: 'Усі квіти' },
  // { href: '/category/wedding-flowers', label: 'Весільні квіти' },
  // { href: '/subscription', label: 'Підписки' },
  // { href: '/gift-cards', label: 'Сертифікати' },
  { href: '/corporate', label: 'Корпоративні замовлення' },
];

const HELP_LINKS = [
  { href: '/delivery', label: 'Доставка та оплата' },
  { href: '/faq', label: 'Питання' },
  { href: '/reviews', label: 'Відгуки' },
  // { href: '/account', label: 'Мій кабінет' },
  { href: '/contact', label: 'Контакти' },
];

export function Footer() {
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
            Родинна майстерня на Соборній площі. Зрізано зранку, звʼязано руками, доставлено до
            ваших дверей того ж дня.
          </p>
        </div>

        <div>
          <div className="footer-heading">Магазин</div>
          <div className="footer-col">
            {SHOP_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="footer-link">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="footer-heading">Допомога</div>
          <div className="footer-col">
            {HELP_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="footer-link">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="footer-heading">Де ми</div>
          <div className="footer-col">
            <span>{SHOP_DETAILS.addressShort}</span>
            <a href={SHOP_DETAILS.phoneHref} className="footer-link">
              {SHOP_DETAILS.phone}
            </a>
            <a href={`mailto:${SHOP_DETAILS.email}`} className="footer-link">
              {SHOP_DETAILS.email}
            </a>
            <span>{SHOP_DETAILS.hours}</span>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
            <Link href="/contact" className="social-btn" title="Instagram" aria-label="Instagram">
              <Instagram size={15} strokeWidth={STROKE} />
            </Link>
            <Link href="/contact" className="social-btn" title="Facebook" aria-label="Facebook">
              <Facebook size={15} strokeWidth={STROKE} />
            </Link>
            <Link href="/contact" className="social-btn" title="Telegram" aria-label="Telegram">
              <Send size={15} strokeWidth={STROKE} />
            </Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 MIG Flowers. Родинна справа з 1998 року.</span>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <Link href="/legal/privacy">Політика приватності</Link>
          <Link href="/legal/terms">Умови користування</Link>
        </div>
      </div>
    </footer>
  );
}
