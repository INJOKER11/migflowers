import type { Product, SortKey } from '@/types';
import { photo } from './images';
import { VARIANT_MULTIPLIERS } from './constants';
import { roundTo10 } from './format';

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'popular', label: 'За популярністю' },
  { value: 'newest', label: 'Найновіші' },
  { value: 'price_asc', label: 'Ціна: від найнижчої' },
  { value: 'price_desc', label: 'Ціна: від найвищої' },
];

/** Мала / Стандарт / Велика against the Signature price. */
export function variantPrice(base: number, variantIndex: number): number {
  return roundTo10(base * VARIANT_MULTIPLIERS[variantIndex]);
}

/** The four shots on the product page: the arrangement, then three angles. */
export function productShots(product: Product, width: number): string[] | null {
  if (!product.image_url) return null;
  return [
    product.image_url,
    photo('bench', width),
    photo('florist', width),
    photo('centerpiece', width),
  ];
}

export function descriptionFor(product: Product): string {
  const note = product.description.charAt(0).toUpperCase() + product.description.slice(1);
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

/* The slider sets a maximum price, so its floor is one step rather than zero —
   a cap of 0 ₴ matches nothing and reads as the opposite of what it does. */
export const PRICE_MIN = 50;
export const PRICE_MAX = 5000;
export const PRICE_STEP = 50;
