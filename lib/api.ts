import type {
  Category,
  Product,
  ProductCategory,
  ProductColor,
  ProductSize,
  Review,
} from '@/types';
import { DeliveryEnum } from '@/lib/content';
import { LOCALES, type Locale } from '@/lib/i18n';

const BASE = process.env.NEXT_PUBLIC_API_URL;

const REVALIDATE = 60;

/**
 * Every request carries `?lang=` so the backend knows which language to
 * answer in. It is required rather than defaulted: a silent `uk` on a Russian
 * page is a bug that never throws, so the compiler asks for it at every call
 * site instead. Paths are left exactly as they were — some end in a slash and
 * some don't, and a redirect between the two forms would drop a POST body.
 */
function query(locale: Locale, params = new URLSearchParams()): string {
  params.set('lang', locale);
  return `?${params}`;
}

interface ApiProductCategory {
  id: number;
  name: string;
  slug: string;
}

interface ApiProductSize {
  id: number;
  name: string;
  price_adjustment: string | null;
  is_default?: boolean;
}

interface ApiProductColor {
  id: number;
  name: string;
  image_url: string | null;
  price_adjustment: string | null;
  is_default?: boolean;
}

interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  discount_price: string | null;
  stock: number;
  is_available: boolean;
  image_url: string | null;
  categories?: ApiProductCategory[];
  /** The old single-category shape. Drop it — and the fallback in
      `toProduct` — once the backend serves `categories` everywhere. */
  category?: ApiProductCategory;
  sizes?: ApiProductSize[];
  colors?: ApiProductColor[];
}

interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  is_active: boolean;
}

interface ApiReview {
  id: number;
  name: string;
  comment: string;
  product_name: string | null;
  rating: number;
  created_at: string;
}

interface ApiPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  image_url: string | null;
  subject: string;
  created_at: string;
}

interface ApiList<T> {
  data: T[];
  links: { first: string | null; last: string | null; prev: string | null; next: string | null };
  meta: { current_page: number; last_page: number; per_page: number; total: number };
}

interface ApiItem<T> {
  data: T;
}

function toProductCategory(raw: ApiProductCategory): ProductCategory {
  return { ...raw, id: String(raw.id) };
}

/* Reads either shape, so the storefront keeps working while the backend moves
   from one category per product to several. */
function toCategories(raw: ApiProduct): ProductCategory[] {
  if (raw.categories) return raw.categories.map(toProductCategory);
  return raw.category ? [toProductCategory(raw.category)] : [];
}

/** A nullable string decimal, as the API sends `price_adjustment` — `null`
    means no surcharge. */
function toAdjustment(raw: string | null): number {
  return raw == null ? 0 : Number(raw);
}

function toProductSize(raw: ApiProductSize): ProductSize {
  return {
    id: String(raw.id),
    name: raw.name,
    price_adjustment: toAdjustment(raw.price_adjustment),
    is_default: raw.is_default ?? false,
  };
}

/* colors[].id is only unique within the product it came from — never keyed
   or cached against other products' colors. */
function toProductColor(raw: ApiProductColor): ProductColor {
  return {
    id: String(raw.id),
    name: raw.name,
    image_url: raw.image_url,
    price_adjustment: toAdjustment(raw.price_adjustment),
    is_default: raw.is_default ?? false,
  };
}

function toProduct(raw: ApiProduct): Product {
  return {
    ...raw,
    id: String(raw.id),
    price: Number(raw.price),
    discount_price: raw.discount_price == null ? undefined : Number(raw.discount_price),
    categories: toCategories(raw),
    sizes: (raw.sizes ?? []).map(toProductSize),
    colors: (raw.colors ?? []).map(toProductColor),
  };
}

function toCategory(raw: ApiCategory): Category {
  return { ...raw, id: String(raw.id) };
}

function toReview(raw: ApiReview): Review {
  return { ...raw, id: String(raw.id) };
}

function toPost(raw: ApiPost): Post {
  return { ...raw, id: String(raw.id) };
}

export interface ProductQuery {
  locale: Locale;
  ids?: string[];
  page?: number;
  perPage?: number;
  maxPrice?: number;
  category?: string;
  sort?: string;
}

export interface CategoryQuery {
  locale: Locale;
  perPage?: number;
}

export interface ReviewQuery {
  locale: Locale;
  page?: number;
  perPage?: number;
}

export async function getProducts(q: ProductQuery): Promise<Product[]> {
  const { locale, ids, page, perPage, category, maxPrice, sort } = q;
  if (ids?.length === 0) return [];

  const params = new URLSearchParams();
  ids?.forEach((id) => params.append('ids[]', id));

  if (maxPrice !== undefined) params.set('max_price', String(maxPrice));
  if (category !== undefined) params.set('category', String(category));
  if (sort !== undefined) params.set('sort', String(sort));
  if (page !== undefined) params.set('page', String(page));
  if (perPage !== undefined) params.set('per_page', String(perPage));

  const res = await fetch(`${BASE}/api/products/${query(locale, params)}`, {
    next: { revalidate: REVALIDATE },
  });

  if (!res.ok) throw new Error(`GET /api/products failed: ${res.status}`);

  const json = (await res.json()) as ApiList<ApiProduct>;
  return json.data.map(toProduct);
}

export async function getProduct(slug: string, locale: Locale): Promise<Product | null> {
  const res = await fetch(`${BASE}/api/products/${slug}${query(locale)}`, {
    next: { revalidate: REVALIDATE },
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GET /api/products/${slug} failed: ${res.status}`);

  const json = (await res.json()) as ApiItem<ApiProduct>;
  return toProduct(json.data);
}

export async function getRelatedProducts(
  product: Product,
  locale: Locale,
  count = 4,
): Promise<Product[]> {
  /* The first category is the one the product leads with; a product filed
     under none skips straight to the popular backfill. */
  const lead = product.categories[0];
  const sameCategory = lead
    ? await getProducts({ locale, category: lead.slug, perPage: count + 1 })
    : [];
  const related = sameCategory.filter((p) => p.id !== product.id).slice(0, count);
  if (related.length >= count) return related;

  const seen = new Set([product.id, ...related.map((p) => p.id)]);
  const popular = await getProducts({ locale, sort: 'popular', perPage: count + seen.size });
  const backfill = popular.filter((p) => !seen.has(p.id)).slice(0, count - related.length);

  return [...related, ...backfill];
}

/**
 * Products, categories and posts each have their own slug per locale —
 * `buket-khmarynka` is `buket-oblachko` on the Russian side — while the id is
 * shared. The backend resolves a Ukrainian slug under `?lang=ru` but not the
 * reverse, and has no lookup by id, so pairing the two URLs of one record goes
 * through the list endpoints: id → slug, one map per locale.
 */
export type SlugKind = 'products' | 'categories' | 'posts';

/* Laravel honours up to 100 here; paging through `last_page` covers the rest. */
const SLUG_PAGE = 100;

export async function getSlugMap(kind: SlugKind, locale: Locale): Promise<Map<string, string>> {
  const slugs = new Map<string, string>();

  for (let page = 1; ; page++) {
    const params = new URLSearchParams({ page: String(page), per_page: String(SLUG_PAGE) });
    const slash = kind === 'posts' ? '' : '/';
    const res = await fetch(`${BASE}/api/${kind}${slash}${query(locale, params)}`, {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) throw new Error(`GET /api/${kind} failed: ${res.status}`);

    /* `posts` answers without the pagination envelope, all in one go. */
    const json = (await res.json()) as { data: { id: number; slug: string }[] } & Partial<
      Pick<ApiList<unknown>, 'meta'>
    >;
    for (const row of json.data) slugs.set(String(row.id), row.slug);
    if (!json.meta || page >= json.meta.last_page) return slugs;
  }
}

/** Every locale's slug for one record. A locale the record is missing from is
    simply absent, and the caller decides what a partial pair means. */
export async function localizedSlugs(
  kind: SlugKind,
  id: string,
): Promise<Partial<Record<Locale, string>>> {
  const maps = await Promise.all(LOCALES.map((locale) => getSlugMap(kind, locale)));
  const slugs: Partial<Record<Locale, string>> = {};
  LOCALES.forEach((locale, i) => {
    const slug = maps[i].get(id);
    if (slug) slugs[locale] = slug;
  });
  return slugs;
}

/**
 * A slug that belongs to another locale, turned into this locale's slug for
 * the same record — or null if it matches nothing. The language switcher keeps
 * the path and swaps only the prefix, so `/ru/product/buket-oblachko` links to
 * `/product/buket-oblachko`, which the backend does not know in Ukrainian.
 */
export async function translateSlug(
  kind: SlugKind,
  slug: string,
  locale: Locale,
): Promise<string | null> {
  for (const other of LOCALES) {
    if (other === locale) continue;
    const theirs = await getSlugMap(kind, other);
    const id = [...theirs].find(([, s]) => s === slug)?.[0];
    if (id) return (await getSlugMap(kind, locale)).get(id) ?? null;
  }
  return null;
}

export async function getCategories(q: CategoryQuery): Promise<Category[]> {
  const { locale, perPage } = q;

  const params = new URLSearchParams();

  if (perPage !== undefined) params.set('per_page', String(perPage));
  const res = await fetch(`${BASE}/api/categories/${query(locale, params)}`, {
    next: { revalidate: REVALIDATE },
  });

  if (!res.ok) throw new Error(`GET /api/categories/ failed: ${res.status}`);

  const json = (await res.json()) as ApiList<ApiCategory>;
  return json.data.map(toCategory);
}

export async function getCategory(slug: string, locale: Locale): Promise<Category | null> {
  const res = await fetch(`${BASE}/api/categories/${slug}${query(locale)}`, {
    next: { revalidate: REVALIDATE },
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GET /api/categories/${slug} failed: ${res.status}`);

  const json = (await res.json()) as ApiItem<ApiCategory>;
  return toCategory(json.data);
}

async function fetchReviewPage(q: ReviewQuery): Promise<ApiList<ApiReview>> {
  const { locale, page, perPage } = q;

  const params = new URLSearchParams();

  if (page !== undefined) params.set('page', String(page));
  if (perPage !== undefined) params.set('per_page', String(perPage));
  const search = query(locale, params);
  const res = await fetch(`${BASE}/api/reviews/${search}`, { next: { revalidate: REVALIDATE } });
  if (!res.ok) throw new Error(`GET /api/reviews/${search} failed: ${res.status}`);

  return (await res.json()) as ApiList<ApiReview>;
}

export async function getReviews(q: ReviewQuery): Promise<Review[]> {
  const json = await fetchReviewPage(q);
  return json.data.map(toReview);
}

const REVIEW_BATCH = 100;

export interface ReviewCollection {
  reviews: Review[];
  total: number;
  average: number;
}

export async function getAllReviews(locale: Locale): Promise<ReviewCollection> {
  const first = await fetchReviewPage({ locale, perPage: REVIEW_BATCH });

  const rest = await Promise.all(
    Array.from({ length: Math.max(0, first.meta.last_page - 1) }, (_, i) =>
      fetchReviewPage({ locale, page: i + 2, perPage: REVIEW_BATCH }),
    ),
  );

  const reviews = [first, ...rest].flatMap((json) => json.data.map(toReview));
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);

  return {
    reviews,
    total: first.meta.total,
    average: reviews.length ? sum / reviews.length : 0,
  };
}

/** Laravel's validation envelope: one or more messages per field. Keys are
    field names, or dotted paths for array members — `items.0.product_id`. */
export type FieldErrors = Record<string, string[]>;

/** A 422 from the API. Carries the per-field messages so the form can show
    them where they belong; every other failure stays a plain Error. */
export class ValidationError extends Error {
  constructor(readonly fields: FieldErrors) {
    super('Validation failed');
    this.name = 'ValidationError';
  }
}

export interface OrderItem {
  product_id: number;
  quantity: number;
  /** Independent of each other — either, both or neither may be picked. */
  size_id?: number;
  color_id?: number;
}

export interface Order {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  /** ISO `YYYY-MM-DD`; the API rejects anything before today. */
  delivery_date: string;
  recipient_name?: string;
  card_message?: string;
  /** Free-text note from the customer — anything the structured fields don't
      cover (entry code, a time window, "ring before you come up"). */
  comment?: string;
  /** `online` or `cash_on_delivery` — see PAYMENT_METHOD in CheckoutForm. */
  payment_method: string;
  delivery_method: DeliveryEnum;
  with_card: boolean;
  district_id: number | null;
  items: OrderItem[];
  /** Looked up against `promo_codes` server-side — an unknown code is a 422
      on this field, not a separate validation step. */
  promo_code?: string;
}

export interface OrderResponse {
  /** The response echoes the submitted order back, plus fields only the
      backend assigns. `order_number` is the one the checkout flow needs, to
      send an offline-paid order to its status page — optional because that's
      only ever been observed, not guaranteed by a documented contract. */
  data: Order & { order_number?: string };
  payment_url?: string;
}

export async function createOrder(values: Order, locale: Locale): Promise<OrderResponse> {
  const res = await fetch(`${BASE}/api/orders${query(locale)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(values),
  });

  if (res.status === 422) {
    const json = (await res.json()) as { errors?: FieldErrors };
    throw new ValidationError(json.errors ?? {});
  }
  if (!res.ok) throw new Error(`POST /api/orders failed: ${res.status}`);

  return res.json();
}

/** What the payment is doing. `pending` covers two different situations: an
    online payment the gateway has not confirmed yet, and an order that was
    never going to be paid online at all — see `payment_method`. */
export type PaymentStatus = 'pending' | 'paid' | 'payment_failed';

interface ApiOrderItemResource {
  product_name: string;
  quantity: number;
  price_at_purchase: string;
  subtotal: string;
  /** Plain localized names, not ids — this is a receipt line, not a form the
      customer picks from again. `null` when that line had no size/colour. */
  size: string | null;
  color: string | null;
}

/** One purchased line, as it was actually charged — the size/colour names as
    they read at order time, not the (possibly since-changed) catalogue ones. */
export interface OrderItemResource {
  product_name: string;
  quantity: number;
  price_at_purchase: number;
  subtotal: number;
  size: string | null;
  color: string | null;
}

function toOrderItem(raw: ApiOrderItemResource): OrderItemResource {
  return {
    product_name: raw.product_name,
    quantity: raw.quantity,
    price_at_purchase: Number(raw.price_at_purchase),
    subtotal: Number(raw.subtotal),
    size: raw.size,
    color: raw.color,
  };
}

interface ApiOrderStatus {
  status: PaymentStatus;
  order_number: string;
  payment_method?: string;
  items?: ApiOrderItemResource[];
}

export interface OrderStatus {
  status: PaymentStatus;
  order_number: string;
  /** `online`, or one of the offline methods. Optional because the endpoint
      does not send it yet: without it a pending order cannot be told apart
      from one waiting on a manager, so the page says something true of both
      and does not poll. */
  payment_method?: string;
  items: OrderItemResource[];
}

function toOrderStatus(raw: ApiOrderStatus): OrderStatus {
  return { ...raw, items: (raw.items ?? []).map(toOrderItem) };
}

export async function getOrderStatus(orderNumber: string, locale: Locale): Promise<OrderStatus> {
  /* The one endpoint that must never be cached: the whole point of the page is
     that the answer changes while the customer is looking at it. */
  const res = await fetch(`${BASE}/api/orders/status/${orderNumber}${query(locale)}`, {
    cache: 'no-store',
  });

  if (res.status === 422) {
    const json = (await res.json()) as { errors?: FieldErrors };
    throw new ValidationError(json.errors ?? {});
  }
  if (!res.ok) throw new Error(`POST /api/orders/status failed: ${res.status}`);
  const data = (await res.json()) as ApiItem<ApiOrderStatus>;
  return toOrderStatus(data.data);
}

/** The contact form. There is no email field: the question is posted straight
    into the shop's Telegram, so `contact` is a handle or a phone number —
    whichever the customer would rather be answered on.

    Field names are the backend's: the body of the question is `question`, not
    `message`. */
export interface Question {
  name: string;
  /** A Telegram @handle or a phone number — free text, the shop decides. */
  contact: string;
  question: string;
  order_number?: string;
}

export async function askQuestion(values: Question, locale: Locale): Promise<void> {
  const res = await fetch(`${BASE}/api/questions${query(locale)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(values),
  });

  if (res.status === 422) {
    const json = (await res.json()) as { errors?: FieldErrors };
    throw new ValidationError(json.errors ?? {});
  }
  /* 204 on success — nothing to parse. */
  if (!res.ok) throw new Error(`POST /api/questions failed: ${res.status}`);
}

/** The newsletter form's first-order discount. A repeat request for an email
    that already has one isn't an error — the endpoint answers `200` with that
    same code again, so the form can't tell "new" from "returning" apart and
    doesn't need to. */
export interface PromoCode {
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  expires_at: string | null;
}

interface ApiPromoCode {
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: string;
  expires_at: string | null;
}

function toPromoCode(raw: ApiPromoCode): PromoCode {
  return { ...raw, discount_value: Number(raw.discount_value) };
}

/** Rate-limited to 5 requests/minute per the route's `throttle:5,1` — a 429
    surfaces to the caller as a plain `Error`, same as any other non-422,
    non-2xx response. */
export async function createFirstOrderPromoCode(email: string, locale: Locale): Promise<PromoCode> {
  const res = await fetch(`${BASE}/api/promo-codes/first-order${query(locale)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (res.status === 422) {
    const json = (await res.json()) as { errors?: FieldErrors };
    throw new ValidationError(json.errors ?? {});
  }
  if (!res.ok) throw new Error(`POST /api/promo-codes/first-order failed: ${res.status}`);

  const json = (await res.json()) as ApiItem<ApiPromoCode>;
  return toPromoCode(json.data);
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url: string | null;
  subject: string;
  created_at: string;
}

export async function getBlogPosts(locale: Locale): Promise<Post[]> {
  const res = await fetch(`${BASE}/api/posts${query(locale)}`, {
    next: { revalidate: REVALIDATE },
  });

  if (!res.ok) throw new Error(`GET /api/posts failed: ${res.status}`);

  const json = (await res.json()) as { data: ApiPost[] };
  return json.data.map(toPost);
}

export async function getBlogPost(slug: string, locale: Locale): Promise<Post | null> {
  const res = await fetch(`${BASE}/api/posts/${slug}${query(locale)}`, {
    next: { revalidate: REVALIDATE },
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GET /api/posts/${slug} failed: ${res.status}`);

  const json = (await res.json()) as ApiItem<ApiPost>;
  return toPost(json.data);
}

export interface District {
  id: number;
  name: string;
  description?: string;
  /** `null` when the area isn't priced — quote comes from the manager. */
  price_for_delivery: string | null;
}

export async function getDistricts(locale: Locale): Promise<District[]> {
  const res = await fetch(`${BASE}/api/districts/${query(locale)}`, {
    next: { revalidate: REVALIDATE },
  });

  if (!res.ok) throw new Error(`GET /api/districts failed: ${res.status}`);

  const json = (await res.json()) as ApiList<District>;
  return json.data;
}
