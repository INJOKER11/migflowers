import type { Category, Product } from '@/types';

const BASE = process.env.NEXT_PUBLIC_API_URL;

/* One hour: the catalogue changes a few times a week, and every page that
   shows products is otherwise fully static. */
const REVALIDATE = 3600;

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
