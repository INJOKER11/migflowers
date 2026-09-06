import type { Category, Product, ProductCategory, Review } from '@/types';
import { DeliveryEnum } from '@/lib/content';
import type { Locale } from '@/lib/i18n';

const BASE = process.env.NEXT_PUBLIC_API_URL;

const REVALIDATE = 1800;

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

function toProduct(raw: ApiProduct): Product {
  return {
    ...raw,
    id: String(raw.id),
    price: Number(raw.price),
    discount_price: raw.discount_price == null ? undefined : Number(raw.discount_price),
    categories: toCategories(raw),
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
  data: Order;
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

export interface OrderStatus {
  status: PaymentStatus;
  order_number: string;
  /** `online`, or one of the offline methods. Optional because the endpoint
      does not send it yet: without it a pending order cannot be told apart
      from one waiting on a manager, so the page says something true of both
      and does not poll. */
  payment_method?: string;
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
  const data = (await res.json()) as ApiItem<OrderStatus>;
  return data.data;
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
export async function createFirstOrderPromoCode(
  email: string,
  locale: Locale,
): Promise<PromoCode> {
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
