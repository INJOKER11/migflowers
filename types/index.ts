export type Occasion = 'День народження' | 'Річниця' | 'Весілля' | 'Співчуття' | 'Без нагоди';

export type FlowerType = 'Троянди' | 'Півонії' | 'Лілії' | 'Сезонні';

export type FlowerColor = 'Рожевий' | 'Білий' | 'Червоний' | 'Мікс';

export type VariantSize = 'Мала' | 'Стандарт' | 'Велика';

export type ProductTag = 'Хіт продажів' | 'Новинка' | 'Довго стоїть';

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
  category: {
    id: string;
    name: string;
    slug: string;
  };
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
  product: Product;
  qty: number;
}

export type SortKey = 'popular' | 'newest' | 'price_desc' | 'price_asc';

export interface Post {
  slug: string;
  kicker: string;
  title: string;
  excerpt: string;
  meta: string;
  img: string;
  body: string[];
}

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
