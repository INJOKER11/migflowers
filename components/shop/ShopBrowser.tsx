'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { COLOR_FILTERS, PRICE_MAX, PRICE_MIN, SORT_OPTIONS, TYPE_FILTERS } from '@/lib/catalog';
import { arrangementCount } from '@/lib/format';
import { ProductGrid } from '@/components/product/ProductGrid';
import { FilterRail } from './FilterRail';
import type { Category, Product, SortKey } from '@/types';

function pick(
  value: string | null,
  allowed: readonly string[] | { value: string; name: string }[],
): string {
  if (Array.isArray(allowed)) {
    const f = allowed.find((a) => a.value === value);
    return f?.value ?? 'All';
  }
  return value && allowed.includes(value) ? value : 'All';
}

function pickSort(value: string | null): SortKey {
  const match = SORT_OPTIONS.find((o) => o.value === value);
  return match ? match.value : 'popular';
}

/* An absent param means no cap. Checked before Number(), because Number(null)
   is 0 — reading the two cases together is what made a dragged-to-floor slider
   snap back to PRICE_MAX. */
function pickCap(value: string | null): number {
  if (value === null) return PRICE_MAX;
  const n = Number(value);
  if (!Number.isFinite(n)) return PRICE_MAX;
  return Math.min(Math.max(n, PRICE_MIN), PRICE_MAX);
}

export function ShopBrowser({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const mappedCategories = categories.map((c) => ({
    value: c.slug,
    name: c.name,
  }));
  const category = pick(params.get('category'), mappedCategories);
  const type = pick(params.get('type'), TYPE_FILTERS);
  const color = pick(params.get('color'), COLOR_FILTERS);
  const sort = pickSort(params.get('sort'));
  const urlCap = pickCap(params.get('maxPrice'));

  const [priceCap, setPriceCap] = useState(urlCap);

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString());
      if (value === null) next.delete(key);
      else next.set(key, value);
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  useEffect(() => setPriceCap(urlCap), [urlCap]);

  useEffect(() => {
    if (priceCap === urlCap) return;
    const timer = setTimeout(
      () => setParam('maxPrice', priceCap === PRICE_MAX ? null : String(priceCap)),
      250,
    );
    return () => clearTimeout(timer);
  }, [priceCap, urlCap, setParam]);

  const setFilter = (key: string, value: string) => setParam(key, value === 'All' ? null : value);

  const clearFilters = () => {
    setPriceCap(PRICE_MAX);
    router.replace(pathname, { scroll: false });
  };

  return (
    <div
      data-shop-layout
      style={{
        display: 'grid',
        gridTemplateColumns: '260px minmax(0, 1fr)',
        gap: 40,
        alignItems: 'start',
      }}
    >
      <FilterRail
        type={type}
        color={color}
        priceCap={priceCap}
        onCategory={(v) => setFilter('category', v)}
        onType={(v) => setFilter('type', v)}
        onColor={(v) => setFilter('color', v)}
        onPriceCap={setPriceCap}
        onClear={clearFilters}
        categories={mappedCategories}
        selectedCategory={category}
      />

      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
            paddingBottom: 16,
            borderBottom: '1px solid var(--color-divider)',
            marginBottom: 26,
          }}
        >
          <span className="tabular" style={{ fontSize: 13, color: 'var(--color-neutral-600)' }}>
            {arrangementCount(products.length)}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <label
              htmlFor="sort"
              style={{
                fontSize: 12,
                letterSpacing: '.12em',
                textTransform: 'uppercase',
                color: 'var(--color-neutral-600)',
              }}
            >
              Сортування
            </label>
            <select
              id="sort"
              className="input"
              value={sort}
              onChange={(e) =>
                setParam('sort', e.target.value === 'popular' ? null : e.target.value)
              }
              style={{ fontSize: 13, padding: '7px 10px' }}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ProductGrid products={products} variant="shop" min="min(100%, 270px)" />

        {/* todo: pagination */}

        {/*{hasMore && (*/}
        {/*  <div style={{ textAlign: 'center', marginTop: 44 }}>*/}
        {/*    <Button*/}
        {/*      variant="ghost"*/}
        {/*      cta*/}
        {/*      /* Tracked wider than the standard CTA — it sits alone under the*/}
        {/*         grid with nothing to line up against. */}
        {/*      style={{ padding: '12px 36px', letterSpacing: '.14em' }}*/}
        {/*      onClick={() => setShown((n) => n + PAGE_SIZE)}*/}
        {/*    >*/}
        {/*      Показати ще*/}
        {/*    </Button>*/}
        {/*  </div>*/}
        {/*)}*/}
      </div>
    </div>
  );
}
