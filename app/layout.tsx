import type { Metadata } from 'next';
import { Cormorant_Garamond, Lora } from 'next/font/google';
import { CartProvider } from '@/lib/cart-context';
import { PromoBar } from '@/components/chrome/PromoBar';
import { Header } from '@/components/chrome/Header';
import { Footer } from '@/components/chrome/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import './globals.css';

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

export const metadata: Metadata = {
  title: 'MIG Flowers — свіжі квіти з доставкою у Львові',
  description:
    'Родинна майстерня на площі Ринок з 1998 року. Букети, зрізані зранку і доставлені того ж дня.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ua" className={`${heading.variable} ${body.variable}`}>
      <body>
        <CartProvider>
          <PromoBar />
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
