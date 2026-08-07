'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function LoginForm() {
  const router = useRouter();
  const [registering, setRegistering] = useState(false);

  const signIn = () => router.push('/account');

  return (
    <>
      <h1 style={{ fontSize: 40, margin: '0 0 8px', textAlign: 'center' }}>
        {registering ? 'Створити акаунт' : 'З поверненням'}
      </h1>
      <p
        style={{
          margin: '0 0 30px',
          fontSize: 14,
          color: 'var(--color-neutral-600)',
          textAlign: 'center',
        }}
      >
        {registering
          ? 'Він збереже ваші адреси та історію замовлень в одному місці.'
          : 'Увійдіть, щоб побачити замовлення та збережені адреси.'}
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          signIn();
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        {registering && (
          <input className="input" placeholder="Ваше імʼя" aria-label="Ваше імʼя" />
        )}
        <input
          className="input"
          type="email"
          placeholder="Ел. пошта"
          aria-label="Ел. пошта"
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Пароль"
          aria-label="Пароль"
          required
        />
        <Button
          type="submit"
          block
          cta
          style={{ marginTop: 6, padding: '13px 0' }}
        >
          {registering ? 'Створити акаунт' : 'Увійти'}
        </Button>
      </form>

      <div className="divider-or">
        <div className="hairline" />
        <span
          style={{
            fontSize: 11.5,
            letterSpacing: '.14em',
            textTransform: 'uppercase',
            color: 'var(--color-neutral-600)',
          }}
        >
          або
        </span>
        <div className="hairline" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Button variant="ghost" block style={{ padding: '12px 0', fontSize: 13 }} onClick={signIn}>
          Увійти через Google
        </Button>
        <Button variant="ghost" block style={{ padding: '12px 0', fontSize: 13 }} onClick={signIn}>
          Увійти через Apple
        </Button>
      </div>

      <p
        style={{
          margin: '26px 0 0',
          fontSize: 13.5,
          color: 'var(--color-neutral-700)',
          textAlign: 'center',
        }}
      >
        {registering ? 'Уже маєте акаунт?' : 'Ще немає акаунта?'}{' '}
        <button
          type="button"
          onClick={() => setRegistering((r) => !r)}
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            font: 'inherit',
            color: 'var(--color-accent-700)',
            cursor: 'pointer',
          }}
        >
          {registering ? 'Увійти' : 'Створити'}
        </button>
      </p>

      <p
        style={{
          margin: '14px 0 0',
          fontSize: 12.5,
          color: 'var(--color-neutral-600)',
          textAlign: 'center',
        }}
      >
        Акаунт для замовлення не потрібен. <Link href="/shop">Купити як гість</Link>.
      </p>
    </>
  );
}
