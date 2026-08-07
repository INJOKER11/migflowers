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
import { CATALOG } from './catalog';
import { PAYMENTS, SLOTS } from './content';
import {
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  PROMO_CODE,
  PROMO_DISCOUNT,
} from './constants';
import type { CartLine, DrawerStep, Product } from '@/types';

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
  savedProducts: Product[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;

  drawerOpen: boolean;
  step: DrawerStep;
  openDrawer: () => void;
  closeDrawer: () => void;
  goToCheckoutStep: () => void;
  goToBasketStep: () => void;
  /** Empties the cart. In the drawer it lands on 'done'; the page redirects. */
  placeOrder: () => void;

  promo: PromoState;
  applyPromo: (code: string) => void;

  slot: number;
  setSlot: (i: number) => void;
  payment: number;
  setPayment: (i: number) => void;
  /** 'Сьогодні, 15:00 – 18:00 · Картка.' */
  orderSummary: string;
}

const CartContext = createContext<CartValue | null>(null);

function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
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

export function CartProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [quantities, setQuantities] = useState<Quantities>({});
  const [saved, setSaved] = useState<Saved>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [step, setStep] = useState<DrawerStep>('basket');
  const [promo, setPromo] = useState<PromoState>('none');
  const [slot, setSlot] = useState(0);
  const [payment, setPayment] = useState(0);

  useEffect(() => {
    setQuantities(readStore<Quantities>(CART_KEY, {}));
    setSaved(readStore<Saved>(WISH_KEY, {}));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) writeStore(CART_KEY, quantities);
  }, [ready, quantities]);

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
    setQuantities((q) => ({ ...q, [product.id]: (q[product.id] ?? 0) + 1 }));
    setDrawerOpen(true);
    setStep('basket');
  }, []);

  const bump = useCallback((id: string, delta: number) => {
    setQuantities((q) => {
      const next = { ...q };
      const value = (next[id] ?? 0) + delta;
      if (value <= 0) delete next[id];
      else next[id] = value;
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setQuantities((q) => {
      const next = { ...q };
      delete next[id];
      return next;
    });
  }, []);

  const clear = useCallback(() => setQuantities({}), []);

  const toggleSaved = useCallback((id: string) => {
    setSaved((s) => ({ ...s, [id]: !s[id] }));
  }, []);

  const lines = useMemo<CartLine[]>(
    () =>
      CATALOG.filter((p) => quantities[p.id]).map((product) => ({
        product,
        qty: quantities[product.id],
      })),
    [quantities],
  );

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.product.price * l.qty, 0),
    [lines],
  );

  const count = useMemo(() => lines.reduce((sum, l) => sum + l.qty, 0), [lines]);

  /* Free over the threshold — and on an empty cart, so the empty drawer shows
     no fee at all. */
  const freeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0;
  const deliveryFee = freeDelivery ? 0 : DELIVERY_FEE;
  const discount = promo === 'applied' ? Math.round(subtotal * PROMO_DISCOUNT) : 0;
  const total = subtotal - discount + deliveryFee;

  const savedIds = useMemo(() => Object.keys(saved).filter((id) => saved[id]), [saved]);
  const savedProducts = useMemo(
    () => savedIds.map((id) => CATALOG.find((p) => p.id === id)).filter((p): p is Product => !!p),
    [savedIds],
  );

  const applyPromo = useCallback((code: string) => {
    setPromo(code.trim().toUpperCase() === PROMO_CODE ? 'applied' : 'rejected');
  }, []);

  const openDrawer = useCallback(() => {
    setDrawerOpen(true);
    setStep('basket');
  }, []);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const goToCheckoutStep = useCallback(() => {
    setStep((current) => (lines.length ? 'checkout' : current));
  }, [lines.length]);

  const goToBasketStep = useCallback(() => setStep('basket'), []);

  const placeOrder = useCallback(() => {
    setQuantities({});
    setPromo('none');
    setStep('done');
  }, []);

  const value: CartValue = {
    ready,
    lines,
    count,
    subtotal,
    deliveryFee,
    discount,
    total,
    isEmpty: lines.length === 0,
    add,
    bump,
    remove,
    clear,
    saved,
    savedIds,
    savedProducts,
    isSaved: (id) => !!saved[id],
    toggleSaved,
    drawerOpen,
    step,
    openDrawer,
    closeDrawer,
    goToCheckoutStep,
    goToBasketStep,
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
