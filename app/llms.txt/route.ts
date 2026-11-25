import { getBlogPosts, getCategories, getDistricts } from '@/lib/api';
import { SHOP_DETAILS, paymentMethods, shopLocation } from '@/lib/content';
import { FREE_DELIVERY_THRESHOLD } from '@/lib/constants';
import { uah } from '@/lib/format';
import { SITE_URL, localeUrl } from '@/lib/i18n';

/**
 * /llms.txt — a plain Markdown summary of the shop for language models, per
 * the llms.txt proposal (llmstxt.org): who we are, the facts an assistant
 * would be asked about (address, hours, delivery, payment), and links to the
 * pages that hold the rest. No major assistant has said it reads the file,
 * so it is a cheap extra, not a ranking lever.
 *
 * Everything is built from the same sources as the pages — the districts,
 * categories and posts from the API, the shop's details from lib/content —
 * so it cannot quote a fee or an hour the site no longer shows. Served from
 * the domain root, outside `[lang]`, like robots.txt and the sitemap; the
 * proxy leaves `.txt` paths alone.
 */
export const revalidate = 3600;

export async function GET() {
  /* Each degrades to an empty list: a summary without districts is better
     than no summary. */
  const [districts, categories, posts] = await Promise.all([
    getDistricts('uk').catch(() => []),
    getCategories({ locale: 'uk' }).catch(() => []),
    getBlogPosts('uk').catch(() => []),
  ]);
  const shop = shopLocation('uk');
  const priced = districts.filter((d) => d.price_for_delivery);

  const lines = [
    '# MIG Flowers',
    '',
    `> Родинна квіткова майстерня в Одесі (Таїрове): букети й квіти поштучно з доставкою по місту в день замовлення або самовивозом. ${shop.address}. ${shop.hours}. Телефон ${SHOP_DETAILS.phone}.`,
    '',
    'Сайт двомовний: українська за адресами без префікса, російська — з префіксом /ru.',
    '',
    '## Магазин',
    '',
    `- Адреса: ${shop.address} (Київський район Одеси, Таїрове)`,
    `- Години роботи: ${shop.hours}`,
    `- Телефон: ${SHOP_DETAILS.phone}`,
    `- Google Карти: ${SHOP_DETAILS.mapsUrl}`,
    '- Instagram: https://www.instagram.com/migflowers__/',
    '',
    '## Доставка',
    '',
    'Доставка по Одесі щодня, у день замовлення, якщо потрібні квіти є в майстерні.',
    ...priced.map((d) => `- ${d.name} район: ${uah(Number(d.price_for_delivery))}`),
    ...(priced.length < districts.length ? ['- За місто: ціну уточнює менеджер'] : []),
    `- Безкоштовно для замовлень від ${uah(FREE_DELIVERY_THRESHOLD)}`,
    '- Самовивіз з майстерні — безкоштовно',
    '',
    '## Оплата',
    '',
    ...paymentMethods('uk').map((m) => `- ${m.title}: ${m.body}`),
    '',
    '## Каталог',
    '',
    `- [Усі квіти й букети](${localeUrl('uk', '/shop')}): каталог з цінами`,
    ...categories.map((c) => `- [${c.name}](${localeUrl('uk', `/category/${c.slug}`)})`),
    '',
    '## Сторінки',
    '',
    `- [Доставка та оплата](${localeUrl('uk', '/delivery')}): ціни за районами`,
    `- [Квіти в Таїровому](${localeUrl('uk', '/tairove')}): крамниця, самовивіз, доставка по району`,
    `- [Контакти](${localeUrl('uk', '/contact')})`,
    `- [Про нас](${localeUrl('uk', '/about')})`,
    `- [Часті питання](${localeUrl('uk', '/faq')})`,
    `- [Відгуки](${localeUrl('uk', '/reviews')})`,
    `- [Умови обміну й повернення](${localeUrl('uk', '/legal/returns')})`,
    ...(posts.length
      ? [
          '',
          '## Журнал',
          '',
          ...posts.map((p) => `- [${p.title}](${localeUrl('uk', `/blog/${p.slug}`)})`),
        ]
      : []),
    '',
    '## Optional',
    '',
    `- [Русская версия сайта](${localeUrl('ru', '/')})`,
    `- [Sitemap](${SITE_URL}/sitemap.xml)`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
