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
import { DeliveryEnum, PaymentEnum } from './content';
import { unitPriceOf } from './catalog';
import { useDict } from './dictionary-context';
import { CARD_MESSAGE_FEE, FREE_DELIVERY_THRESHOLD, PROMO_CODE, PROMO_DISCOUNT } from './constants';
import type { CartLine, Product, ProductColor, ProductSize } from '@/types';
import { uah } from '@/lib/format';

type Saved = Record<string, boolean>;

const CART_KEY = 'mig.cart';
const WISH_KEY = 'mig.wish';

/** Composite of product + selected size + selected colour: "Rose bouquet, L,
    Red" and "Rose bouquet, M, White" are different cart lines, so their
    quantities never merge. A plain product with nothing selected keys the
    same way, with both ids empty. */
function lineKey(productId: string, sizeId?: string | null, colorId?: string | null): string {
  return `${productId}::${sizeId ?? ''}::${colorId ?? ''}`;
}

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

  add: (product: Product, size?: ProductSize | null, color?: ProductColor | null) => void;
  bump: (productId: string, delta: number, sizeId?: string | null, colorId?: string | null) => void;
  qtyOf: (productId: string, sizeId?: string | null, colorId?: string | null) => number;
  remove: (productId: string, sizeId?: string | null, colorId?: string | null) => void;
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

/* Keyed by `lineKey`, but only loosely — the mount effect below rebuilds the
   keys from each entry's own product/size/color rather than trusting the
   stored key, so a cart saved before size/colour existed still bumps and
   removes correctly. */
type Entries = {
  [key: string]: {
    product: Product;
    size: ProductSize | null;
    color: ProductColor | null;
    qty: number;
  };
};

function isEntries(v: unknown): v is Entries {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) return false;
  return Object.values(v).every(
    (e) =>
      typeof e === 'object' &&
      e !== null &&
      typeof (e as { qty?: unknown }).qty === 'number' &&
      (e as { product?: { id?: unknown } }).product?.id != null,
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const dict = useDict();
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState<Saved>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [promo, setPromo] = useState<PromoState>('none');
  const [slot, setSlot] = useState(0);
  const [delivery, setDeliveryState] = useState(DeliveryEnum.delivery);
  const [district, setDistrict] = useState<number | null>(null);
  const [payment, setPayment] = useState(PaymentEnum.card);
  const [entries, setEntries] = useState<Entries>({});
  const [zoneFee, setZoneFee] = useState(0);
  const [hasCardMessage, setHasCardMessage] = useState(false);

  useEffect(() => {
    const stored = readStore<Entries>(CART_KEY, {}, isEntries);
    /* Rebuilt under the key each entry's own product/size/color computes
       today, not the key it happened to be stored under — a cart saved
       before size/colour existed has no size/color fields at all, and its
       key was just the bare product id. */
    const normalized: Entries = {};
    for (const entry of Object.values(stored)) {
      const size = entry.size ?? null;
      const color = entry.color ?? null;
      normalized[lineKey(entry.product.id, size?.id, color?.id)] = {
        product: entry.product,
        size,
        color,
        qty: entry.qty,
      };
    }
    setEntries(normalized);
    setSaved(readStore<Saved>(WISH_KEY, {}));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) writeStore(CART_KEY, entries);
  }, [ready, entries]);

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

  const setDelivery = useCallback((v: DeliveryEnum) => {
    setDeliveryState(v);
    if (v === DeliveryEnum.delivery) {
      setPayment((p) => (p === PaymentEnum.on_site ? PaymentEnum.card : p));
    }
  }, []);

  const add = useCallback(
    (product: Product, size: ProductSize | null = null, color: ProductColor | null = null) => {
      const key = lineKey(product.id, size?.id, color?.id);
      setEntries((prev) => ({
        ...prev,
        [key]: { product, size, color, qty: (prev[key]?.qty ?? 0) + 1 },
      }));
    },
    [],
  );

  const bump = useCallback(
    (productId: string, delta: number, sizeId?: string | null, colorId?: string | null) => {
      const key = lineKey(productId, sizeId, colorId);
      setEntries((prev) => {
        const existing = prev[key];
        if (!existing) return prev;
        if (existing.qty + delta <= 0) {
          const { [key]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [key]: { ...existing, qty: existing.qty + delta } };
      });
    },
    [],
  );

  const remove = useCallback((productId: string, sizeId?: string | null, colorId?: string | null) => {
    const key = lineKey(productId, sizeId, colorId);
    setEntries((prev) => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const clear = useCallback(() => setEntries({}), []);

  const toggleSaved = useCallback((id: string) => {
    setSaved((s) => ({ ...s, [id]: !s[id] }));
  }, []);

  const lines = useMemo<CartLine[]>(() => {
    return Object.entries(entries).map(([key, { product, size, color, qty }]) => ({
      key,
      product,
      size,
      color,
      qty,
    }));
  }, [entries]);

  /* `unitPriceOf`, not `product.price`: a discounted bouquet has to cost in
     the cart what the shop quoted on its card (plus whatever the size/colour
     picks add), and the free-delivery threshold has to be measured against
     that same figure. */
  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + unitPriceOf(l.product, l.size, l.color) * l.qty, 0),
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
    setEntries({});
    setPromo('none');
    setHasCardMessage(false);
  }, []);

  /* The order line is assembled here rather than in the checkout rail, so the
     drawer, the rail and the confirmation all quote it the same way. */
  const slotLabels = [dict.checkout.slotToday, dict.checkout.slotTomorrow, dict.checkout.slotPick];
  const paymentLabels: Record<PaymentEnum, string> = {
    [PaymentEnum.card]: dict.checkout.payCard,
    [PaymentEnum.online]: dict.checkout.payOnline,
    [PaymentEnum.on_site]: dict.checkout.payOnSite,
  };

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
    qtyOf: (productId, sizeId, colorId) => entries[lineKey(productId, sizeId, colorId)]?.qty ?? 0,
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
    /* `deliveryFee`, not `zoneFee`: the zone's price is what the district
       costs, the fee is what this order pays — they differ the moment the
       subtotal clears the free-delivery threshold, and quoting the wrong one
       put "100 ₴" under a summary that said "Безкоштовно". */
    orderSummary:
      delivery === DeliveryEnum.delivery
        ? `${slotLabels[slot] ?? ''} · ${deliveryFee ? uah(deliveryFee) : dict.cart.free} · ${paymentLabels[payment]}.`
        : `${dict.cart.pickup} · ${paymentLabels[payment]}.`,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside <CartProvider>');
  return context;
}
