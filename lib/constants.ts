/** Figures that appear on more than one screen live here, nowhere else. */

/** Delivery is free at or above this subtotal, in every zone. */
export const FREE_DELIVERY_THRESHOLD = 2500;

/** Standard city delivery fee. */
export const DELIVERY_FEE = 150;

/** The one promo code the storefront knows. */
export const PROMO_CODE = 'BLOOM10';

/** Ten per cent off the subtotal. */
export const PROMO_DISCOUNT = 0.1;

/** Order before this and the flowers leave the same afternoon. */
export const SAME_DAY_CUTOFF = '14:00';

/** Freshness guarantee, in days. */
export const FRESHNESS_DAYS = 7;

/** Мала / Стандарт / Велика, against the Signature price. */
export const VARIANT_MULTIPLIERS = [0.75, 1, 1.4] as const;

/** Shop shows this many, then adds this many again. */
export const PAGE_SIZE = 9;
