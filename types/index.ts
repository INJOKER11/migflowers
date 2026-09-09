export type Occasion = 'День народження' | 'Річниця' | 'Весілля' | 'Співчуття' | 'Без нагоди';

export type FlowerType = 'Троянди' | 'Півонії' | 'Лілії' | 'Сезонні';

export type FlowerColor = 'Рожевий' | 'Білий' | 'Червоний' | 'Мікс';

export type ProductTag = 'Хіт продажів' | 'Новинка' | 'Довго стоїть';

/** A category as a product carries it: the name and the slug, without the
    description and the cover photo `Category` has. */
export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

/** Shared across products — S/M/L exist the same way on every bouquet that
    offers sizes at all. */
export interface ProductSize {
  id: string;
  name: string;
  /** 0 when the API sent `null` — no surcharge for this size. */
  price_adjustment: number;
  /** At most one size per product carries this. `false` when the API omits
      the field, so a stale cache entry from before it existed still renders. */
  is_default: boolean;
}

/** Specific to one product — "Red Rose" is a colour of the Rose bouquet, not
    a shade every product can pick from. `id` is only unique within the
    product it came from; never dedupe or cache these across products. */
export interface ProductColor {
  id: string;
  name: string;
  image_url: string | null;
  /** 0 when the API sent `null` — no surcharge for this colour. */
  price_adjustment: number;
  /** At most one colour per product carries this. `false` when the API omits
      the field, so a stale cache entry from before it existed still renders. */
  is_default: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount_price?: number;
  image_url: string | null;
  is_available: boolean;
  stock: number;
  /** A product can sit in several — «троянди» and «на день народження» are
      both true of the same bouquet. Possibly empty: nothing in the UI may
      assume a first element. */
  categories: ProductCategory[];
  /** Independent of `colors` — a product can offer sizes, colours, both or
      neither. Usually empty. */
  sizes: ProductSize[];
  colors: ProductColor[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  is_active: boolean;
}

export interface Review {
  id: string;
  name: string;
  comment: string;
  rating: number;
  product_name: string | null;
  created_at: string;
}

export interface CartLine {
  /** Composite of product id + selected size id + selected colour id — a
      product picked in two different sizes is two lines, not one with a
      merged quantity. Only for React list keys; `bump`/`remove`/`qtyOf` take
      the product/size/color ids separately. */
  key: string;
  product: Product;
  size: ProductSize | null;
  color: ProductColor | null;
  qty: number;
}

export type SortKey = 'popular' | 'newest' | 'price_desc' | 'price_asc';

export interface Faq {
  q: string;
  a: string;
}

export interface OccasionEntry {
  name: Occasion;
  blurb: string;
}

export interface TeamMember {
  name: string;
  role: string;
  img: string;
  bio: string;
}

export interface Cadence {
  label: string;
  per: string;
  mult: number;
}

export interface Plan {
  tier: string;
  name: string;
  base: number;
  features: [string, string, string];
}

export type LegalDoc = 'privacy' | 'terms';

export interface LegalSection {
  h: string;
  p: string;
}

export interface LegalDocument {
  title: string;
  sections: LegalSection[];
}
