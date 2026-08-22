import type { Cadence, Plan, TeamMember } from '@/types';
import { photo, type PhotoKey } from './images';

/** Home — why us, four numbered columns. */
export const WHY_US = [
  {
    n: '01',
    title: 'Доставка того ж дня',
    body: 'Замовляйте до 14:00 — і квіти приїдуть уже по обіді, у будь-який куток міста.',
  },
  {
    n: '02',
    title: 'Свіжість сім днів',
    body: 'Якщо квітка зівʼяне раніше, ніж пройде тиждень, напишіть нам — замінимо букет без жодних питань.',
  },
  {
    n: '03',
    title: 'Ручна робота, ніяких наборів',
    body: 'Кожен букет складає один флорист від початку до кінця — у майстерні за крамницею на Соборній.',
  },
  {
    n: '04',
    title: 'Прості повернення',
    body: 'Не той день, не та адреса, змінилися плани. Напишіть протягом доби — усе владнаємо.',
  },
];

/** Home — six square plates, @migflowers. */
const GALLERY_KEYS: PhotoKey[] = [
  'pinkRoses',
  'centerpiece',
  'pinkVase',
  'roses',
  'beige',
  'table',
];
export const GALLERY = GALLERY_KEYS.map((key) => photo(key, 500));

export const TEAM: TeamMember[] = [
  {
    name: 'Марія',
    role: 'Засновниця, 1998',
    img: photo('florist', 700),
    bio: 'Почала з розкладного столика і відра гвоздик. Досі приходить у суботу перевірити троянди.',
  },
  {
    name: 'Ірина',
    role: 'Головна флористка',
    img: photo('bridal', 700),
    bio: 'Їздить на ринок о пʼятій. Кожне весільне замовлення робить сама, від початку до кінця.',
  },
  {
    name: 'Галина',
    role: 'Майстерня і доставка',
    img: photo('table', 700),
    bio: 'Відповідає на телефон, завантажує авто і знає код кожних дверей в історичному центрі.',
  },
];

/** Checkout — shared by the drawer and the full page. */
export const SLOTS = ['Сьогодні, 15:00 – 18:00', 'Завтра зранку', 'Вибрати дату'] as const;
export enum DeliveryEnum {
  delivery = 'delivery',
  takeaway = 'takeaway',
}
export const DELIVERY = [
  {
    value: DeliveryEnum.delivery,
    name: 'Доставка',
  },
  {
    value: DeliveryEnum.takeaway,
    name: 'Самовивіз',
  },
];

export enum PaymentEnum {
  card = 'card',
  online = 'online',
  on_site = 'on_site',
}
export const PAYMENTS = [
  {
    value: PaymentEnum.card,
    name: 'Переказ на карту',
  },
  {
    value: PaymentEnum.online,
    name: 'Онлайн оплата',
  },
  {
    value: PaymentEnum.on_site,
    name: 'Оплата на мiсцi',
  },
];

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
      'Безкоштовна доставка в усі зони',
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

export const PAYMENT_METHODS = [
  {
    title: 'Картка',
    body: 'Visa і Mastercard через захищений шлюз. Ми не бачимо і не зберігаємо номер картки.',
  },
  {
    title: 'Apple та Google Pay',
    body: 'Один дотик під час оформлення з телефона. Найшвидший спосіб надіслати квіти просто з вулиці.',
  },
  {
    title: 'Готівка курʼєру',
    body: 'Оплата курʼєру на порозі. Доступно лише в Таїрово і Черемушках.',
  },
  {
    title: 'Банківський переказ',
    body: 'Для корпоративних клієнтів і постійних щотижневих замовлень. Виставляємо рахунок раз на місяць.',
  },
];

/** Corporate — volume discounts. */
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

/** Contact. */
export const SHOP_DETAILS = {
  address: 'Соборна площа 14, Одеса 65000',
  addressShort: 'Соборна площа 14, Одеса',
  phone: '+380 67 123 45 67',
  phoneHref: 'tel:+380671234567',
  email: 'hello@migflowers.ua',
  hours: 'Щодня, 08:00 – 21:00',
};
