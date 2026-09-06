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

const PAYMENT_METHODS: Record<Locale, { title: string; body: string }[]> = {
  uk: [
    {
      title: 'Картка',
      body: 'Visa і Mastercard через захищений шлюз. Ми не бачимо і не зберігаємо номер картки.',
    },
    {
      title: 'Apple та Google Pay',
      body: 'Один дотик під час оформлення з телефона. Найшвидший спосіб надіслати квіти просто з вулиці.',
    },
    {
      title: 'Банківський переказ',
      body: 'Для корпоративних клієнтів і постійних щотижневих замовлень. Виставляємо рахунок раз на місяць.',
    },
  ],
  ru: [
    {
      title: 'Карта',
      body: 'Visa и Mastercard через защищённый шлюз. Мы не видим и не храним номер карты.',
    },
    {
      title: 'Apple и Google Pay',
      body: 'Одно касание при оформлении с телефона. Самый быстрый способ отправить цветы прямо с улицы.',
    },
    {
      title: 'Банковский перевод',
      body: 'Для корпоративных клиентов и постоянных еженедельных заказов. Выставляем счёт раз в месяц.',
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
};

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
