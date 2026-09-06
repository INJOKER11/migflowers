'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import {
  Check,
  CircleAlert,
  Clock,
  RefreshCw,
  STROKE,
  STROKE_LIGHT,
} from '@/components/ui/icons';
import { getOrderStatus, type OrderStatus } from '@/lib/api';
import { SHOP_DETAILS } from '@/lib/content';
import { useDict } from '@/lib/dictionary-context';
import { useLocale } from '@/lib/use-locale';
import { fill } from '@/lib/format';

/* An online payment is confirmed by the gateway out of band, so a pending one
   is worth re-checking for a couple of minutes after the customer lands back
   here. Nothing else is: an offline order changes when a person marks it paid,
   which will not happen while the page is open. */
const POLL_MS = 5000;
const POLL_LIMIT = 24;

function Panel({
  icon,
  title,
  body,
  children,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <>
      {icon}
      <h1 style={{ fontSize: 40, margin: '22px 0 14px' }}>{title}</h1>
      <p
        style={{
          margin: '0 auto',
          maxWidth: '48ch',
          fontSize: 15.5,
          lineHeight: 1.85,
          color: 'var(--color-neutral-700)',
        }}
      >
        {body}
      </p>
      {children}
    </>
  );
}

function Actions({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        justifyContent: 'center',
        marginTop: 32,
        flexWrap: 'wrap',
      }}
    >
      {children}
    </div>
  );
}

export function OrderStatusView({ orderNumber }: { orderNumber: string }) {
  const locale = useLocale();
  const t = useDict().orderStatus;

  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  /* Bumped by the poll and by the refresh button; the fetch effect watches it. */
  const [attempt, setAttempt] = useState(0);
  const [polls, setPolls] = useState(0);

  useEffect(() => {
    let ignore = false;
    setFailed(false);

    getOrderStatus(orderNumber, locale)
      .then((data) => {
        if (!ignore) setOrder(data);
      })
      .catch(() => {
        if (!ignore) setFailed(true);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [orderNumber, locale, attempt]);

  /* Only an online payment settles on its own, and only if the API tells us
     the method — see `OrderStatus.payment_method`. */
  const awaitingGateway = order?.status === 'pending' && order.payment_method === 'online';
  const polling = awaitingGateway && polls < POLL_LIMIT;

  useEffect(() => {
    if (!polling) return;
    const timer = setTimeout(() => {
      setPolls((n) => n + 1);
      setAttempt((n) => n + 1);
    }, POLL_MS);
    return () => clearTimeout(timer);
  }, [polling, attempt]);

  if (loading) {
    return (
      <p style={{ fontSize: 15, color: 'var(--color-neutral-600)' }} aria-live="polite">
        {t.loading}
      </p>
    );
  }

  const phone = { phone: SHOP_DETAILS.phone };

  if (failed || !order) {
    return (
      <Panel
        icon={
          <CircleAlert
            size={38}
            strokeWidth={STROKE_LIGHT}
            color="var(--color-neutral-600)"
            style={{ display: 'inline-block' }}
          />
        }
        title={t.errorTitle}
        body={fill(t.errorBody, phone)}
      >
        <Actions>
          <Button cta style={{ padding: '12px 28px' }} onClick={() => setAttempt((n) => n + 1)}>
            {t.retry}
          </Button>
        </Actions>
      </Panel>
    );
  }

  const number = (
    <div style={{ fontSize: 12.5, color: 'var(--color-neutral-600)', marginTop: 22 }}>
      {t.numberLabel}
      <br />
      <span className="tabular" style={{ wordBreak: 'break-all' }}>
        {order.order_number}
      </span>
    </div>
  );

  if (order.status === 'paid') {
    return (
      <Panel
        icon={
          <Check
            size={38}
            strokeWidth={STROKE_LIGHT}
            color="var(--color-accent)"
            style={{ display: 'inline-block' }}
          />
        }
        title={t.paidTitle}
        body={t.paidBody}
      >
        {number}
        <Actions>
          <Button href="/shop" cta style={{ padding: '12px 28px' }}>
            {t.toShop}
          </Button>
        </Actions>
      </Panel>
    );
  }

  if (order.status === 'payment_failed') {
    return (
      <Panel
        icon={
          <CircleAlert
            size={38}
            strokeWidth={STROKE_LIGHT}
            color="var(--color-accent-2)"
            style={{ display: 'inline-block' }}
          />
        }
        title={t.failedTitle}
        body={fill(t.failedBody, phone)}
      >
        {number}
        <Actions>
          <Button href="/checkout" cta style={{ padding: '12px 28px' }}>
            {t.backToCheckout}
          </Button>
          <Button href="/shop" variant="ghost" cta style={{ padding: '12px 26px' }}>
            {t.toShop}
          </Button>
        </Actions>
      </Panel>
    );
  }

  /* Pending. Three shades of it: waiting on the gateway, waiting on a manager,
     or — with no `payment_method` from the API — something true of both. */
  const method = order.payment_method;

  if (method === 'online') {
    return (
      <Panel
        icon={
          <Clock
            size={38}
            strokeWidth={STROKE_LIGHT}
            color="var(--color-accent)"
            style={{ display: 'inline-block' }}
          />
        }
        title={t.pendingOnlineTitle}
        body={fill(t.pendingOnlineBody, phone)}
      >
        {number}
        <Actions>
          <Button
            variant="ghost"
            cta
            style={{ padding: '12px 26px' }}
            onClick={() => setAttempt((n) => n + 1)}
          >
            <RefreshCw size={14} strokeWidth={STROKE} />
            {t.refresh}
          </Button>
        </Actions>
        <div
          style={{ fontSize: 12, color: 'var(--color-neutral-600)', marginTop: 14, height: 16 }}
          aria-live="polite"
        >
          {polling ? t.checking : ''}
        </div>
      </Panel>
    );
  }

  return (
    <Panel
      icon={
        <Clock
          size={38}
          strokeWidth={STROKE_LIGHT}
          color="var(--color-accent)"
          style={{ display: 'inline-block' }}
        />
      }
      title={method ? t.pendingOfflineTitle : t.pendingTitle}
      body={method ? t.pendingOfflineBody : fill(t.pendingBody, phone)}
    >
      {number}
      <Actions>
        <Button href="/shop" cta style={{ padding: '12px 28px' }}>
          {t.toShop}
        </Button>
        <Button
          variant="ghost"
          cta
          style={{ padding: '12px 26px' }}
          onClick={() => setAttempt((n) => n + 1)}
        >
          <RefreshCw size={14} strokeWidth={STROKE} />
          {t.refresh}
        </Button>
      </Actions>
    </Panel>
  );
}
