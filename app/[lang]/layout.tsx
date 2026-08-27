import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Cormorant_Garamond, Lora } from 'next/font/google';
import { CartProvider } from '@/lib/cart-context';
import { PromoBar } from '@/components/chrome/PromoBar';
import { Header } from '@/components/chrome/Header';
import { Footer } from '@/components/chrome/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { JsonLd } from '@/components/seo/JsonLd';
import { getDictionary } from '@/lib/dictionaries';
import { DEFAULT_LOCALE, HTML_LANG, LOCALES, SITE_URL, isLocale } from '@/lib/i18n';
import { floristSchema } from '@/lib/schema';
import '../globals.css';

const heading = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-heading',
  display: 'swap',
});

const body = Lora({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-body',
  display: 'swap',
});

interface LangParams {
  params: Promise<{ lang: string }>;
}

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  /* Defaults only. Deliberately no `alternates` here: metadata is merged down
     the tree, so a canonical set on the layout would be inherited by every page
     that forgot to set its own — and they would all claim to be the home page.
     Each page calls `pageMetadata` for itself. */
  return {
    /* Every relative URL in metadata resolves against this. It has to be the
       www host: the apex and http both 308 here, so an apex base would make
       each canonical point at a redirect. */
    metadataBase: new URL(SITE_URL),
    title: dict.seo.brand.title,
    description: dict.seo.brand.description,
  };
}

export default async function RootLayout({
  children,
  params,
}: LangParams & { children: React.ReactNode }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);

  return (
    <html lang={HTML_LANG[lang]} className={`${heading.variable} ${body.variable}`}>
      <body>
        {/* Site-wide, so it sits in the layout rather than on the home page —
            the shop is the same shop on every route. */}
        <JsonLd data={floristSchema()} />
        <CartProvider>
          <PromoBar dict={dict.chrome} />
          <Header nav={dict.nav} chrome={dict.chrome} />
          <main>{children}</main>
          <Footer dict={dict.footer} />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
