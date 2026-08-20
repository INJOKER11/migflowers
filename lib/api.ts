import type { Category, Product, Review } from '@/types';

const BASE = process.env.NEXT_PUBLIC_API_URL;

const REVALIDATE = 1800;

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
  category: { id: number; name: string; slug: string };
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

interface ApiList<T> {
  data: T[];
  links: { first: string | null; last: string | null; prev: string | null; next: string | null };
  meta: { current_page: number; last_page: number; per_page: number; total: number };
}

interface ApiItem<T> {
  data: T;
}

function toProduct(raw: ApiProduct): Product {
  return {
    ...raw,
    id: String(raw.id),
    price: Number(raw.price),
    discount_price: raw.discount_price == null ? undefined : Number(raw.discount_price),
    category: { ...raw.category, id: String(raw.category.id) },
  };
}

function toCategory(raw: ApiCategory): Category {
  return { ...raw, id: String(raw.id) };
}

function toReview(raw: ApiReview): Review {
  return { ...raw, id: String(raw.id) };
}

export interface ProductQuery {
  ids?: string[];
  page?: number;
  perPage?: number;
  maxPrice?: number;
  category?: string;
  sort?: string;
}

export interface CategoryQuery {
  perPage?: number;
}

export interface ReviewQuery {
  page?: number;
  perPage?: number;
}

export async function getProducts(query: ProductQuery = {}): Promise<Product[]> {
  const { ids, page, perPage, category, maxPrice, sort } = query;
  if (ids?.length === 0) return [];

  const params = new URLSearchParams();
  ids?.forEach((id) => params.append('ids[]', id));

  if (maxPrice !== undefined) params.set('max_price', String(maxPrice));
  if (category !== undefined) params.set('category', String(category));
  if (sort !== undefined) params.set('sort', String(sort));
  if (page !== undefined) params.set('page', String(page));
  if (perPage !== undefined) params.set('per_page', String(perPage));

  const search = params.size ? `?${params}` : '';
  const res = await fetch(`${BASE}/api/products/${search}`, { next: { revalidate: REVALIDATE } });

  if (!res.ok) throw new Error(`GET /api/products failed: ${res.status}`);

  const json = (await res.json()) as ApiList<ApiProduct>;
  return json.data.map(toProduct);
}

export async function getProduct(slug: string): Promise<Product | null> {
  const res = await fetch(`${BASE}/api/products/${slug}`, { next: { revalidate: REVALIDATE } });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GET /api/products/${slug} failed: ${res.status}`);

  const json = (await res.json()) as ApiItem<ApiProduct>;
  return toProduct(json.data);
}

export async function getCategories(query: CategoryQuery = {}): Promise<Category[]> {
  const { perPage } = query;

  const params = new URLSearchParams();

  if (perPage !== undefined) params.set('per_page', String(perPage));
  const search = params.size ? `?${params}` : '';
  const res = await fetch(`${BASE}/api/categories/${search}`, { next: { revalidate: REVALIDATE } });

  if (!res.ok) throw new Error(`GET /api/categories/ failed: ${res.status}`);

  const json = (await res.json()) as ApiList<ApiCategory>;
  return json.data.map(toCategory);
}

export async function getCategory(slug: string): Promise<Category | null> {
  const res = await fetch(`${BASE}/api/categories/${slug}`, { next: { revalidate: REVALIDATE } });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GET /api/categories/${slug} failed: ${res.status}`);

  const json = (await res.json()) as ApiItem<ApiCategory>;
  return toCategory(json.data);
}

async function fetchReviewPage(query: ReviewQuery = {}): Promise<ApiList<ApiReview>> {
  const { page, perPage } = query;

  const params = new URLSearchParams();

  if (page !== undefined) params.set('page', String(page));
  if (perPage !== undefined) params.set('per_page', String(perPage));
  const search = params.size ? `?${params}` : '';
  const res = await fetch(`${BASE}/api/reviews/${search}`, { next: { revalidate: REVALIDATE } });
  if (!res.ok) throw new Error(`GET /api/reviews/${search} failed: ${res.status}`);

  return (await res.json()) as ApiList<ApiReview>;
}

export async function getReviews(query: ReviewQuery = {}): Promise<Review[]> {
  const json = await fetchReviewPage(query);
  return json.data.map(toReview);
}

const REVIEW_BATCH = 100;

export interface ReviewCollection {
  reviews: Review[];
  total: number;
  average: number;
}

export async function getAllReviews(): Promise<ReviewCollection> {
  const first = await fetchReviewPage({ perPage: REVIEW_BATCH });

  const rest = await Promise.all(
    Array.from({ length: Math.max(0, first.meta.last_page - 1) }, (_, i) =>
      fetchReviewPage({ page: i + 2, perPage: REVIEW_BATCH }),
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

export type FieldErrors = Record<string, string[]>;

export class OrderValidationError extends Error {
  constructor(readonly fields: FieldErrors) {
    super('Order validation failed');
    this.name = 'OrderValidationError';
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
  delivery_date: string;
  recipient_name?: string;
  card_message?: string;
  payment_method: string;
  items: OrderItem[];
}

export async function createOrder(values: Order): Promise<unknown> {
  const res = await fetch(`${BASE}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(values),
  });

  if (res.status === 422) {
    const json = (await res.json()) as { errors?: FieldErrors };
    throw new OrderValidationError(json.errors ?? {});
  }
  if (!res.ok) throw new Error(`POST /api/orders failed: ${res.status}`);

  return res.json();
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url?: string;
  subject: string;
  created_at: string;
}

export async function getBlogPosts(): Promise<Post[]> {
  const res = await fetch(`${BASE}/api/posts`, { next: { revalidate: REVALIDATE } });

  if (!res.ok) throw new Error(`POST /api/posts failed: ${res.status}`);

  const json = (await res.json()) as ApiList<Post>;
  return json.data;
}

export async function getBlogPost(slug: string): Promise<Post | null> {
  const res = await fetch(`${BASE}/api/posts/${slug}`, { next: { revalidate: REVALIDATE } });

  if (!res.ok) if (!res.ok) throw new Error(`POST /api/posts/${slug} failed: ${res.status}`);
  const json = (await res.json()) as ApiItem<Post>;
  return json.data;
}
