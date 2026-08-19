'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
// import { CATALOG } from './catalog';
import { PAYMENTS, SLOTS } from './content';
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD, PROMO_CODE, PROMO_DISCOUNT } from './constants';
import type { CartLine, Product } from '@/types';

type Quantities = Record<string, number>;
type Saved = Record<string, boolean>;

const CART_KEY = 'mig.cart';
const WISH_KEY = 'mig.wish';

export type PromoState = 'none' | 'applied' | 'rejected';

interface CartValue {
  ready: boolean;

  lines: CartLine[];
  count: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  isEmpty: boolean;

  add: (product: Product) => void;
  bump: (id: string, delta: number) => void;
  remove: (id: string) => void;
  clear: () => void;

  saved: Saved;
  savedIds: string[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;

  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  placeOrder: () => void;

  promo: PromoState;
  applyPromo: (code: string) => void;

  slot: number;
  setSlot: (i: number) => void;
  payment: number;
  setPayment: (i: number) => void;
  orderSummary: string;
}

const CartContext = createContext<CartValue | null>(null);

function readStore<T>(key: string, fallback: T, isValid?: (v: unknown) => v is T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (isValid && !isValid(parsed)) return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}

function writeStore(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode, quota — the cart still works for this session */
  }
}

type Products = {
  [id: string]: {
    product: Product;
    qty: number;
  };
};

function isProducts(v: unknown): v is Products {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) return false;
  return Object.values(v).every(
    (e) =>
      typeof e === 'object' &&
      e !== null &&
      typeof (e as CartLine).qty === 'number' &&
      (e as CartLine).product?.id != null,
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState<Saved>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [promo, setPromo] = useState<PromoState>('none');
  const [slot, setSlot] = useState(0);
  const [payment, setPayment] = useState(0);
  const [products, setProducts] = useState<Products>({});

  useEffect(() => {
    setProducts(readStore<Products>(CART_KEY, {}, isProducts));
    setSaved(readStore<Saved>(WISH_KEY, {}));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) writeStore(CART_KEY, products);
  }, [ready, products]);

  useEffect(() => {
    if (ready) writeStore(WISH_KEY, saved);
  }, [ready, saved]);

  /* The drawer is modal: the page behind it must not scroll. */
  useEffect(() => {
    if (!drawerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [drawerOpen]);

  const add = useCallback((product: Product) => {
    setProducts((p) => {
      return {
        ...p,
        [product.id]: {
          product: product,
          qty: (p[product.id]?.qty ?? 0) + 1,
        },
      };
    });
    setDrawerOpen(true);
  }, []);

  const bump = useCallback((id: string, delta: number) => {
    setProducts((p) => {
      if ((p[id]?.qty ?? 0) + delta <= 0) {
        const { [id]: _, ...restProducts } = p;
        return restProducts;
      }
      return {
        ...p,
        [id]: {
          product: p[id]?.product,
          qty: (p[id]?.qty ?? 0) + delta,
        },
      };
    });
  }, []);

  const remove = useCallback((id: string) => {
    setProducts((p) => {
      const { [id]: _, ...restProducts } = p;
      return restProducts;
    });
  }, []);

  const clear = useCallback(() => setProducts({}), []);

  const toggleSaved = useCallback((id: string) => {
    setSaved((s) => ({ ...s, [id]: !s[id] }));
  }, []);

  const lines = useMemo<CartLine[]>(() => {
    return Object.values(products).reduce((acc, { product, qty }) => {
      acc.push({ product: product, qty: qty });
      return acc;
    }, [] as CartLine[]);
  }, [products]);

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.product.price * l.qty, 0),
    [lines],
  );

  const count = useMemo(() => lines.reduce((sum, l) => sum + l.qty, 0), [lines]);

  const freeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0;
  const deliveryFee = freeDelivery ? 0 : DELIVERY_FEE;
  // const discount = promo === 'applied' ? Math.round(subtotal * PROMO_DISCOUNT) : 0;
  const total = subtotal + deliveryFee;

  const savedIds = useMemo(() => Object.keys(saved).filter((id) => saved[id]), [saved]);

  const applyPromo = useCallback((code: string) => {
    setPromo(code.trim().toUpperCase() === PROMO_CODE ? 'applied' : 'rejected');
  }, []);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const placeOrder = useCallback(() => {
    setProducts({});
    setPromo('none');
  }, []);

  const value: CartValue = {
    ready,
    lines,
    count,
    subtotal,
    deliveryFee,
    discount: 0,
    total,
    isEmpty: lines.length === 0,
    add,
    bump,
    remove,
    clear,
    saved,
    savedIds,
    isSaved: (id) => !!saved[id],
    toggleSaved,
    drawerOpen,
    openDrawer,
    closeDrawer,
    placeOrder,
    promo,
    applyPromo,
    slot,
    setSlot,
    payment,
    setPayment,
    orderSummary: `${SLOTS[slot]} · ${PAYMENTS[payment]}.`,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside <CartProvider>');
  return context;
}
