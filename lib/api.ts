import type { Product } from '@/types';

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

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE}/api/products/`, { next: { revalidate: REVALIDATE } });
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
