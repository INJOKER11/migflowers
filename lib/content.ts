import type { Cadence, Plan } from '@/types';
import type { Locale } from './i18n';
import { photo, type PhotoKey } from './images';

/**
 * Copy that is content rather than interface — the home page's four columns,
 * the payment explanations, the shop's own address — lives here in both
 * languages. Labels and buttons live in `./dictionaries`.
 *
 * The blocks that belong to the retired routes (`/subscription`,
 * `/gift-cards`, `/account`) are Ukrainian only: those pages answer
 * `notFound()`, so nothing renders them. Translate them if one comes back.
 */

/** Home — why us, numbered columns. */
const WHY_US: Record<Locale, { n: string; title: string; body: string }[]> = {
  uk: [
    {
      n: '01',
      title: 'Доставка того ж дня',
      body: 'За наявності квітів. Найшвидша доставка буде, якщо ви зателефонуєте на +380 67 422 72 98.',
    },
    {
      n: '02',
      title: 'Ручна робота, ніяких наборів',
      body: 'Кожен букет складає один флорист від початку до кінця — просто в майстерні на Корольова.',
    },
    {
      n: '03',
      title: 'Прості повернення',
      body: 'Не той день, не та адреса, змінилися плани. Напишіть протягом доби — усе владнаємо.',
    },
  ],
  ru: [
    {
      n: '01',
      title: 'Доставка в день заказа',
      body: 'При наличии цветов. Быстрее всего доставим, если вы позвоните на +380 67 422 72 98.',
    },
    {
      n: '02',
      title: 'Ручная работа, никаких наборов',
      body: 'Каждый букет собирает один флорист от начала до конца — прямо в мастерской на Королёва.',
    },
    {
      n: '03',
      title: 'Простые возвраты',
      body: 'Не тот день, не тот адрес, изменились планы. Напишите в течение суток — всё уладим.',
    },
  ],
};

export function whyUs(locale: Locale) {
  return WHY_US[locale];
}

/**
 * The home page's plain-text block — the one place the page says, in words a
 * searcher types, what the shop sells and where. Everything that can drift is
 * a placeholder filled from the API or `lib/constants`: `{districts}` (the
 * priced districts), `{free}` (the free-delivery threshold), `{categories}`
 * (rendered as links). Every other claim is one the rest of the site already
 * makes — address, hours, the substitution rule from the terms.
 */
const HOME_INTRO: Record<
  Locale,
  { title: string; shop: string; delivery: string; suburbs: string; catalogue: string; and: string }
> = {
  uk: {
    title: 'Купити квіти в Одесі з доставкою',
    shop:
      'MIG Flowers — родинна квіткова майстерня в Таїрово, на вулиці Академіка Корольова, 22. ' +
      'Купити квіти в Одесі тут можна двома способами: замовити букет на сайті з доставкою ' +
      'або забрати його самостійно — крамниця відкрита щодня з 08:00 до 21:00.',
    delivery:
      'Доставляємо квіти по Одесі щодня й без вихідних — у {districts} райони. Ціна доставки залежить від ' +
      'району, а для замовлень від {free} доставка безкоштовна. Букет можна отримати в день ' +
      'замовлення, якщо потрібні квіти є в майстерні; якщо ні — ми зателефонуємо й запропонуємо ' +
      'рівноцінну заміну або інший день.',
    suburbs: 'Доставку за місто узгоджуємо з менеджером.',
    catalogue:
      'У каталозі — {categories}. До букета можна додати листівку з вашим текстом, а оплатити ' +
      'замовлення онлайн, переказом на карту або на місці під час самовивозу.',
    and: 'і',
  },
  ru: {
    title: 'Купить цветы в Одессе с доставкой',
    shop:
      'MIG Flowers — семейная цветочная мастерская в Таирово, на улице Академика Королёва, 22. ' +
      'Купить цветы в Одессе здесь можно двумя способами: заказать букет на сайте с доставкой ' +
      'или забрать его самостоятельно — магазин открыт ежедневно с 08:00 до 21:00.',
    delivery:
      'Доставляем цветы по Одессе каждый день и без выходных — в {districts} районы. Цена доставки зависит ' +
      'от района, а для заказов от {free} доставка бесплатная. Букет можно получить в день ' +
      'заказа, если нужные цветы есть в мастерской; если нет — мы позвоним и предложим ' +
      'равноценную замену или другой день.',
    suburbs: 'Доставку за город согласовываем с менеджером.',
    catalogue:
      'В каталоге — {categories}. К букету можно добавить открытку с вашим текстом, а оплатить ' +
      'заказ онлайн, переводом на карту или на месте при самовывозе.',
    and: 'и',
  },
};

export function homeIntro(locale: Locale) {
  return HOME_INTRO[locale];
}

/** Home — six square plates, @migflowers. */
const GALLERY_KEYS: PhotoKey[] = [
  'pinkRoses',
  'centerpiece',
  'pinkVase',
  'roses',
  'beige',
  'table',
];
export const GALLERY = GALLERY_KEYS.map((key) => photo(key));

/** Checkout — the three delivery slots, in the order the chips show them.
    Their labels are `checkout.slotToday`/`slotTomorrow`/`slotPick`. */
export const SLOT_COUNT = 3;

export enum DeliveryEnum {
  delivery = 'delivery',
  takeaway = 'takeaway',
}
export const DELIVERY_METHODS = [DeliveryEnum.delivery, DeliveryEnum.takeaway] as const;

export enum PaymentEnum {
  card = 'card',
  online = 'online',
  on_site = 'on_site',
}
export const PAYMENT_OPTIONS = [PaymentEnum.card, PaymentEnum.online, PaymentEnum.on_site] as const;

export const CADENCES: Cadence[] = [
  { label: 'Щотижня', per: 'щотижня', mult: 1 },
  { label: 'Раз на два тижні', per: 'раз на два тижні', mult: 0.94 },
  { label: 'Щомісяця', per: 'щомісяця', mult: 0.88 },
];

export const PLANS: Plan[] = [
  {
    tier: 'Мала',
    name: 'Вʼязанка',
    base: 690,
    features: [
      'Невеликий букет, звʼязаний руками',
      'Сезонний, ніколи не повторюється',
      'Безкоштовна доставка по Одесі',
    ],
  },
  {
    tier: 'Основна',
    name: 'Наручень',
    base: 1290,
    features: [
      'Наш стандартний домашній розмір',
      'Готовий до вази, напоєний за ніч',
      'Пропустити чи призупинити будь-якого тижня',
    ],
  },
  {
    tier: 'Велика',
    name: 'Акцент',
    base: 2390,
    features: [
      'Велика композиція для входу',
      'Флорист вибирає найкраще на ринку',
      'Пріоритетна доставка зранку',
    ],
  },
];

/** The recommended tier is bordered in accent. */
export const RECOMMENDED_PLAN_INDEX = 1;

export const GIFT_AMOUNTS = [500, 1000, 2000, 3500];
export const GIFT_DELIVERY = ['Ел. поштою', 'Друком і поштою'] as const;

/* The same three options the checkout offers (`PaymentEnum`), in the same
   order — the delivery page used to list card / Apple Pay / bank transfer,
   which matched nothing a customer could actually pick. */
const PAYMENT_METHODS: Record<Locale, { title: string; body: string }[]> = {
  uk: [
    {
      title: 'Онлайн оплата',
      body: 'Visa, Mastercard, Apple Pay і Google Pay через LiqPay від ПриватБанку. Номер картки вводиться на захищеній сторінці банку — ми його не бачимо і не зберігаємо.',
    },
    {
      title: 'Переказ на карту',
      body: 'Після оформлення менеджер звʼяжеться з вами й надішле реквізити. Замовлення підтверджуємо, щойно переказ надійде.',
    },
    {
      title: 'Оплата на місці',
      body: 'Для самовивозу: оплачуєте, коли забираєте букет у майстерні на Корольова, 22.',
    },
  ],
  ru: [
    {
      title: 'Онлайн оплата',
      body: 'Visa, Mastercard, Apple Pay и Google Pay через LiqPay от ПриватБанка. Номер карты вводится на защищённой странице банка — мы его не видим и не храним.',
    },
    {
      title: 'Перевод на карту',
      body: 'После оформления менеджер свяжется с вами и пришлёт реквизиты. Заказ подтверждаем, как только перевод поступит.',
    },
    {
      title: 'Оплата на месте',
      body: 'Для самовывоза: оплачиваете, когда забираете букет в мастерской на Королёва, 22.',
    },
  ],
};

export function paymentMethods(locale: Locale) {
  return PAYMENT_METHODS[locale];
}

/** Corporate — volume discounts. The route is retired, so Ukrainian only. */
export const VOLUME_TIERS = [
  { volume: '10 – 24 композиції', discount: '10%', terms: 'Картка або переказ' },
  { volume: '25 – 49 композицій', discount: '15%', terms: 'Рахунок раз на місяць' },
  { volume: '50 – 99 композицій', discount: '20%', terms: 'Рахунок раз на місяць' },
  { volume: '100+ або постійне замовлення', discount: 'За домовленістю', terms: 'Договір' },
];

/** Account — the demo order history behind the tracking card. */
export const ORDER_HISTORY = [
  {
    id: '4417',
    date: '3 серп. 2026',
    items: 'Півонії та ранункулюси',
    total: '₴2 450',
    status: 'У дорозі' as const,
  },
  {
    id: '4310',
    date: '18 лип. 2026',
    items: 'Ринкова вʼязка ×2',
    total: '₴3 300',
    status: 'Доставлено' as const,
  },
  {
    id: '4188',
    date: '2 черв. 2026',
    items: 'Білі маки у вазі',
    total: '₴1 320',
    status: 'Доставлено' as const,
  },
  {
    id: '3902',
    date: '8 бер. 2026',
    items: 'Червоні троянди у папері',
    total: '₴2 640',
    status: 'Доставлено' as const,
  },
];

export const SAVED_ADDRESSES = [
  { label: 'Дім', address: 'Шевченка 22, кв. 14, Одеса' },
  { label: 'Мама', address: 'Коперника 9, кв. 3, Одеса' },
];

/** Account — the four-node progress rail; the first two are done. */
export const TRACKING_STAGES = ['Зрізано', 'Звʼязано', 'У дорозі', 'Доставлено'];
export const TRACKING_DONE = 2;

/** Contact — the parts that read the same in either language. */
export const SHOP_DETAILS = {
  phone: '+380 67 422 72 98',
  phoneHref: 'tel:+380674227298',
  // email: 'hello@migflowers.ua',
  /* The door on Корольова, 22 — shared by the contact-page map and the
     `Florist` structured data, so the pin and the rich result agree. */
  lat: 46.4109788,
  lng: 30.7195882,
  /** The Google Business Profile listing — reviews, hours, Directions. */
  mapsUrl:
    'https://www.google.com/maps/place/Mig+Flowers/@46.4108451,30.720441,1849m/' +
    'data=!3m1!1e3!4m6!3m5!1s0x40c6335ed354e533:0x9930a2f04e64e251!8m2!3d46.4109788!4d30.7195882' +
    '!16s%2Fg%2F11zx2pw7ml',
};

/**
 * The legal seller. LiqPay's monitoring requires the ФОП's registration data
 * on the site, matching the merchant cabinet exactly — without it the bank
 * stops paying out card payments. Legal data, so the same text in both
 * locales.
 *
 * TODO(owner): fill in from the ЄДР extract / LiqPay cabinet. `seller()`
 * fails the production build while any field is empty, so the site cannot
 * ship without them.
 */
const SELLER = {
  /** «ФОП Прізвище Імʼя По батькові», as registered. */
  name: '',
  /** РНОКПП — 10 digits. */
  taxId: '',
  /** The registration address from the ЄДР extract (may differ from the shop's). */
  address: '',
};

export function seller() {
  const missing = Object.entries(SELLER)
    .filter(([, value]) => !value.trim())
    .map(([key]) => key);
  if (missing.length && process.env.NODE_ENV === 'production') {
    throw new Error(`SELLER in lib/content.ts is incomplete (${missing.join(', ')}) — LiqPay requires it on the site.`);
  }
  return {
    name: SELLER.name || '[ФОП — не заповнено]',
    taxId: SELLER.taxId || '[РНОКПП]',
    address: SELLER.address || '[адреса реєстрації]',
    phone: SHOP_DETAILS.phone,
  };
}

/** Contact — the parts that don't: the street and the opening hours. */
const SHOP_LOCATION: Record<Locale, { address: string; addressShort: string; hours: string }> = {
  uk: {
    address: 'вул. Академіка Корольова, 22, Одеса',
    addressShort: 'вул. Академіка Корольова, 22',
    hours: 'Щодня, 08:00 – 21:00',
  },
  ru: {
    address: 'ул. Академика Королёва, 22, Одесса',
    addressShort: 'ул. Академика Королёва, 22',
    hours: 'Ежедневно, 08:00 – 21:00',
  },
};

export function shopLocation(locale: Locale) {
  return SHOP_LOCATION[locale];
}
