import type { Occasion, Product, SortKey } from '@/types';
import { photo } from './images';
import { VARIANT_MULTIPLIERS } from './constants';
import { roundTo10 } from './format';

/** Twelve arrangements — the whole shop. */
export const CATALOG: Product[] = [
  {
    id: 'p1',
    name: 'Півонії та ранункулюси',
    note: 'пудровий, 25 стебел',
    price: 2450,
    tag: 'Хіт продажів',
    img: photo('pinkRoses', 700),
    occasion: 'Річниця',
    type: 'Півонії',
    color: 'Рожевий',
    rank: 1,
    age: 3,
  },
  {
    id: 'p2',
    name: 'Садові троянди',
    note: 'айворі, 15 стебел',
    price: 1890,
    img: photo('beige', 700),
    occasion: 'Весілля',
    type: 'Троянди',
    color: 'Білий',
    rank: 3,
    age: 6,
  },
  {
    id: 'p3',
    name: 'Білі маки у вазі',
    note: 'бурштинове скло в комплекті',
    price: 1320,
    tag: 'Новинка',
    img: photo('poppies', 700),
    occasion: 'Без нагоди',
    type: 'Сезонні',
    color: 'Білий',
    rank: 6,
    age: 1,
  },
  {
    id: 'p4',
    name: 'Ринкова в’язка',
    note: 'на вибір флориста',
    price: 1650,
    img: photo('table', 700),
    occasion: 'Без нагоди',
    type: 'Сезонні',
    color: 'Мікс',
    rank: 2,
    age: 4,
  },
  {
    id: 'p5',
    name: 'Низька настільна',
    note: 'для довгого столу',
    price: 2100,
    img: photo('centerpiece', 700),
    occasion: 'Весілля',
    type: 'Сезонні',
    color: 'Мікс',
    rank: 8,
    age: 7,
  },
  {
    id: 'p6',
    name: 'Червоні троянди у папері',
    note: 'двадцять одне стебло',
    price: 2640,
    img: photo('redHeld', 700),
    occasion: 'Річниця',
    type: 'Троянди',
    color: 'Червоний',
    rank: 4,
    age: 9,
  },
  {
    id: 'p7',
    name: 'Рожеві пелюстки у вазі',
    note: 'прозоре скло',
    price: 980,
    tag: 'Довго стоїть',
    img: photo('pinkVase', 700),
    occasion: 'День народження',
    type: 'Сезонні',
    color: 'Рожевий',
    rank: 7,
    age: 5,
  },
  {
    id: 'p8',
    name: 'Троянди у цвіту',
    note: 'садові, 30 стебел',
    price: 3200,
    img: photo('roses', 700),
    occasion: 'Річниця',
    type: 'Троянди',
    color: 'Рожевий',
    rank: 5,
    age: 8,
  },
  {
    id: 'p9',
    name: 'Букет нареченої',
    note: 'вершковий і зелений',
    price: 2980,
    img: photo('bridal', 700),
    occasion: 'Весілля',
    type: 'Троянди',
    color: 'Білий',
    rank: 9,
    age: 2,
  },
  {
    id: 'p10',
    name: 'Осінній стіл',
    note: 'глибокий червоний, низька',
    price: 1740,
    img: photo('redTable', 700),
    occasion: 'День народження',
    type: 'Сезонні',
    color: 'Червоний',
    rank: 10,
    age: 10,
  },
  {
    id: 'p11',
    name: 'Білі для співчуття',
    note: 'лілії та матіола',
    price: 2200,
    img: photo('roseBouquet', 700),
    occasion: 'Співчуття',
    type: 'Лілії',
    color: 'Білий',
    rank: 11,
    age: 11,
  },
  {
    id: 'p12',
    name: 'Ранункулюси у вазі',
    note: 'пудровий, у воді',
    price: 1560,
    img: photo('vaseMix', 700),
    occasion: 'День народження',
    type: 'Півонії',
    color: 'Рожевий',
    rank: 12,
    age: 12,
  },
];

export function getProduct(id: string): Product | undefined {
  return CATALOG.find((p) => p.id === id);
}

export function relatedTo(id: string, count = 4): Product[] {
  return CATALOG.filter((p) => p.id !== id).slice(0, count);
}

export function byOccasion(occasion: Occasion): Product[] {
  return CATALOG.filter((p) => p.occasion === occasion);
}

/** Ready to send today — the home page's quick-buy row. */
export function quickBuy(count = 4): Product[] {
  return CATALOG.slice(0, count);
}

export const SORTERS: Record<SortKey, (a: Product, b: Product) => number> = {
  popular: (a, b) => a.rank - b.rank,
  new: (a, b) => a.age - b.age,
  low: (a, b) => a.price - b.price,
  high: (a, b) => b.price - a.price,
};

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'popular', label: 'За популярністю' },
  { value: 'new', label: 'Найновіші' },
  { value: 'low', label: 'Ціна: від найнижчої' },
  { value: 'high', label: 'Ціна: від найвищої' },
];

/** Мала / Стандарт / Велика against the Signature price. */
export function variantPrice(base: number, variantIndex: number): number {
  return roundTo10(base * VARIANT_MULTIPLIERS[variantIndex]);
}

/** The four shots on the product page: the arrangement, then three angles. */
export function productShots(product: Product, width: number): string[] {
  return [
    product.img,
    photo('bench', width),
    photo('florist', width),
    photo('centerpiece', width),
  ];
}

export function descriptionFor(product: Product): string {
  const note = product.note.charAt(0).toUpperCase() + product.note.slice(1);
  return (
    'Складено одним флористом від початку до кінця того ранку, коли букет їде до вас. ' +
    note +
    ', напоєно за ніч у глибокій воді та загорнуто в бавовняний папір, стебла — у водяній подушці. ' +
    'Оскільки ми купуємо на ринку щоранку, окрему квітку може бути замінено на рівноцінну; форма й колір будуть такими, як на фото.'
  );
}

export const CARE_TEXT =
  'Підріжте кожне стебло під гострим кутом під проточною водою, перш ніж ставити у вазу, і обірвіть листя, ' +
  'яке опиниться під водою. Міняйте воду щодня, а не доливайте. Тримайте букет подалі від прямого сонця, ' +
  'радіаторів і вази з фруктами — фрукти, що доспівають, виділяють етилен, який скорочує життя майже будь-якій ' +
  'зрізаній квітці. За кімнатної температури розраховуйте на сім днів, у прохолодній кімнаті — довше.';

/** Filter vocabularies. 'Усі' means no constraint. */
export const OCCASION_FILTERS = [
  'Усі',
  'День народження',
  'Річниця',
  'Весілля',
  'Співчуття',
  'Без нагоди',
] as const;

export const TYPE_FILTERS = ['Усі', 'Троянди', 'Півонії', 'Лілії', 'Сезонні'] as const;

export const COLOR_FILTERS = ['Усі', 'Рожевий', 'Білий', 'Червоний', 'Мікс'] as const;

export const PRICE_MIN = 600;
export const PRICE_MAX = 3600;
export const PRICE_STEP = 100;

export interface ShopFilters {
  occasion: string;
  type: string;
  color: string;
  priceCap: number;
  sort: SortKey;
}

export function filterCatalog(f: ShopFilters): Product[] {
  return CATALOG.filter(
    (p) =>
      (f.occasion === 'Усі' || p.occasion === f.occasion) &&
      (f.type === 'Усі' || p.type === f.type) &&
      (f.color === 'Усі' || p.color === f.color) &&
      p.price <= f.priceCap,
  ).sort(SORTERS[f.sort]);
}
