'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  COLOR_FILTERS,
  OCCASION_FILTERS,
  PRICE_MAX,
  SORT_OPTIONS,
  TYPE_FILTERS,
  // filterCatalog,
} from '@/lib/catalog';
import { PAGE_SIZE } from '@/lib/constants';
import { arrangementCount } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { ProductGrid } from '@/components/product/ProductGrid';
import { FilterRail } from './FilterRail';
import type { Product, SortKey } from '@/types';

function pick(value: string | null, allowed: readonly string[]): string {
  return value && allowed.includes(value) ? value : 'Усі';
}

function pickSort(value: string | null): SortKey {
  const match = SORT_OPTIONS.find((o) => o.value === value);
  return match ? match.value : 'popular';
}

function pickCap(value: string | null): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.min(n, PRICE_MAX) : PRICE_MAX;
}

export function ShopBrowser({ products }: { products: Product[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const occasion = pick(params.get('occasion'), OCCASION_FILTERS);
  const type = pick(params.get('type'), TYPE_FILTERS);
  const color = pick(params.get('color'), COLOR_FILTERS);
  const sort = pickSort(params.get('sort'));
  const urlCap = pickCap(params.get('max'));

  const [priceCap, setPriceCap] = useState(urlCap);
  const [shown, setShown] = useState(PAGE_SIZE);

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
      () => setParam('max', priceCap === PRICE_MAX ? null : String(priceCap)),
      250,
    );
    return () => clearTimeout(timer);
  }, [priceCap, urlCap, setParam]);

  /* Changing any filter puts the page back to the first nine. */
  useEffect(() => {
    setShown(PAGE_SIZE);
  }, [occasion, type, color, priceCap]);

  const setFilter = (key: string, value: string) => setParam(key, value === 'Усі' ? null : value);

  const clearFilters = () => {
    setPriceCap(PRICE_MAX);
    router.replace(pathname, { scroll: false });
  };

  // const matches = filterCatalog({ occasion, type, color, priceCap, sort });
  // const visible = matches.slice(0, shown);
  // const hasMore = matches.length > shown;

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
        occasion={occasion}
        type={type}
        color={color}
        priceCap={priceCap}
        onOccasion={(v) => setFilter('occasion', v)}
        onType={(v) => setFilter('type', v)}
        onColor={(v) => setFilter('color', v)}
        onPriceCap={setPriceCap}
        onClear={clearFilters}
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
