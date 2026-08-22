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
import { DeliveryEnum, PaymentEnum, PAYMENTS, SLOTS } from './content';
import { CARD_MESSAGE_FEE, FREE_DELIVERY_THRESHOLD, PROMO_CODE, PROMO_DISCOUNT } from './constants';
import type { CartLine, Product } from '@/types';
import { uah } from '@/lib/format';

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
  qtyOf: (id: string) => number;
  remove: (id: string) => void;
  syncProduct: (id: string, fresh: Product | null) => void;
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
  setSlot: (v: number) => void;
  payment: PaymentEnum;
  setPayment: (v: PaymentEnum) => void;
  delivery: DeliveryEnum;
  setDelivery: (v: DeliveryEnum) => void;
  district: number | null;
  setDistrict: (v: number | null) => void;
  zoneFee: number;
  setZoneFee: (v: number) => void;
  hasCardMessage: boolean;
  setHasCardMessage: (v: boolean) => void;
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
  const [delivery, setDelivery] = useState(DeliveryEnum.delivery);
  const [district, setDistrict] = useState<number | null>(null);
  const [payment, setPayment] = useState(PaymentEnum.card);
  const [products, setProducts] = useState<Products>({});
  const [zoneFee, setZoneFee] = useState(0);
  const [hasCardMessage, setHasCardMessage] = useState(false);

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

  useEffect(() => {
    if (!drawerOpen) return;
    const root = document.documentElement;
    const gutter = window.innerWidth - root.clientWidth;
    const previous = { overflow: root.style.overflow, paddingRight: root.style.paddingRight };
    root.style.overflow = 'hidden';
    if (gutter > 0) root.style.paddingRight = `${gutter}px`;
    return () => {
      root.style.overflow = previous.overflow;
      root.style.paddingRight = previous.paddingRight;
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

  const syncProduct = useCallback((id: string, fresh: Product | null) => {
    setProducts((p) => {
      if (!p[id]) return p;
      if (!fresh || !fresh.is_available) {
        const { [id]: _, ...restProducts } = p;
        return restProducts;
      }
      return { ...p, [id]: { product: fresh, qty: p[id].qty } };
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
  const deliveryFee = delivery === DeliveryEnum.takeaway || freeDelivery ? 0 : zoneFee;
  const cardMessageFee = hasCardMessage ? CARD_MESSAGE_FEE : 0;

  // const discount = promo === 'applied' ? Math.round(subtotal * PROMO_DISCOUNT) : 0;
  const total = subtotal + deliveryFee + cardMessageFee;

  const savedIds = useMemo(() => Object.keys(saved).filter((id) => saved[id]), [saved]);

  const applyPromo = useCallback((code: string) => {
    setPromo(code.trim().toUpperCase() === PROMO_CODE ? 'applied' : 'rejected');
  }, []);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const placeOrder = useCallback(() => {
    setProducts({});
    setPromo('none');
    setHasCardMessage(false);
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
    qtyOf: (id) => products[id]?.qty ?? 0,
    remove,
    syncProduct,
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
    delivery,
    setDelivery,
    district,
    setDistrict,
    payment,
    setPayment,
    zoneFee,
    setZoneFee,
    hasCardMessage,
    setHasCardMessage,
    orderSummary:
      delivery === DeliveryEnum.delivery
        ? `${SLOTS[slot]}${zoneFee ? ` · ${uah(zoneFee)}` : ''} · ${PAYMENTS.find((p) => p.value === payment)?.name ?? ''}.`
        : `Самовивіз · ${PAYMENTS.find((p) => p.value === payment)?.name ?? ''}.`,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside <CartProvider>');
  return context;
}
