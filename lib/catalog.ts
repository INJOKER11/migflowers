import type { Product, ProductColor, ProductSize, SortKey } from '@/types';
import { photo } from './images';
import type { Dictionary } from './dictionaries';
import type { Locale } from './i18n';

/** The sort keys, in menu order. They are URL values, so they never change
    with the locale — only the labels do. */
export const SORT_KEYS: SortKey[] = ['popular', 'newest', 'price_asc', 'price_desc'];

export function sortOptions(dict: Dictionary['shop']): { value: SortKey; label: string }[] {
  return [
    { value: 'popular', label: dict.sortPopular },
    { value: 'newest', label: dict.sortNewest },
    { value: 'price_asc', label: dict.sortPriceAsc },
    { value: 'price_desc', label: dict.sortPriceDesc },
  ];
}

/**
 * A discount only counts when it is one: the API's `discount_price` is a free
 * field, and a null, a zero or a number at or above the normal price all mean
 * "no discount" rather than "this bouquet is free".
 */
export function isDiscounted(product: Product): boolean {
  return (
    product.discount_price !== undefined &&
    product.discount_price > 0 &&
    product.discount_price < product.price
  );
}

/** What the customer actually pays — the discount when there is one, the
    normal price otherwise. Every price the storefront quotes goes through
    this, so a discounted product cannot show one number and charge another. */
export function priceOf(product: Product): number {
  return isDiscounted(product) ? product.discount_price! : product.price;
}

/** Size and colour surcharges are independent and additive — a product with
    both picked pays for both, one with only one picked pays for just that
    one. */
export function optionAdjustment(size: ProductSize | null, color: ProductColor | null): number {
  return (size?.price_adjustment ?? 0) + (color?.price_adjustment ?? 0);
}

/** What a specific size/colour selection costs — the quoted price (discounted
    when there is one) plus whatever surcharge the picks carry. */
export function unitPriceOf(
  product: Product,
  size: ProductSize | null,
  color: ProductColor | null,
): number {
  return priceOf(product) + optionAdjustment(size, color);
}

/** What a product's photograph is described as. The lead category earns its
    place in the alt text — "Букет Ніжність — троянди" says more than the name
    alone — but a product filed under none still needs one. */
export function productAlt(product: Product): string {
  const lead = product.categories[0];
  return lead ? `${product.name} — ${lead.name}` : product.name;
}

/** The four shots on the product page: the arrangement, then three angles. */
export function productShots(product: Product): string[] | null {
  if (!product.image_url) return null;
  return [product.image_url, photo('bench'), photo('florist'), photo('centerpiece')];
}

/* The product's own note is the middle of the sentence, so the wrapper comes
   in two halves rather than as one `{note}` template. */
const DESCRIPTION: Record<Locale, { before: string; after: string }> = {
  uk: {
    before: 'Складено одним флористом від початку до кінця того ранку, коли букет їде до вас. ',
    after:
      ', напоєно за ніч у глибокій воді та загорнуто в бавовняний папір, стебла — у водяній подушці. ' +
      'Оскільки ми купуємо на ринку щоранку, окрему квітку може бути замінено на рівноцінну; форма й колір будуть такими, як на фото.',
  },
  ru: {
    before: 'Собран одним флористом от начала до конца в то утро, когда букет едет к вам. ',
    after:
      ', напоён за ночь в глубокой воде и завёрнут в хлопковую бумагу, стебли — в водяной подушке. ' +
      'Поскольку мы закупаемся на рынке каждое утро, отдельный цветок может быть заменён на равноценный; форма и цвет будут такими, как на фото.',
  },
};

export function descriptionFor(product: Product, locale: Locale): string {
  const note = product.description.charAt(0).toUpperCase() + product.description.slice(1);
  const wrap = DESCRIPTION[locale];
  return wrap.before + note + wrap.after;
}

const CARE: Record<Locale, string> = {
  uk:
    'Підріжте кожне стебло під гострим кутом під проточною водою, перш ніж ставити у вазу, і обірвіть листя, ' +
    'яке опиниться під водою. Міняйте воду щодня, а не доливайте. Тримайте букет подалі від прямого сонця, ' +
    'радіаторів і вази з фруктами — фрукти, що доспівають, виділяють етилен, який скорочує життя майже будь-якій ' +
    'зрізаній квітці. За кімнатної температури розраховуйте на сім днів, у прохолодній кімнаті — довше.',
  ru:
    'Подрежьте каждый стебель под острым углом под проточной водой, прежде чем ставить в вазу, и оборвите листья, ' +
    'которые окажутся под водой. Меняйте воду каждый день, а не доливайте. Держите букет подальше от прямого солнца, ' +
    'радиаторов и вазы с фруктами — дозревающие фрукты выделяют этилен, который сокращает жизнь почти любому ' +
    'срезанному цветку. При комнатной температуре рассчитывайте на семь дней, в прохладной комнате — дольше.',
};

export function careText(locale: Locale): string {
  return CARE[locale];
}

/** Filter vocabularies. 'Усі' means no constraint. Only the category and the
    price cap are wired up today — the type and colour groups are commented out
    in `FilterRail`, which is why these are still Ukrainian only. */
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

/* The slider sets a maximum price, so its floor is one step rather than zero —
   a cap of 0 ₴ matches nothing and reads as the opposite of what it does. */
export const PRICE_MIN = 50;
export const PRICE_MAX = 5000;
export const PRICE_STEP = 50;
