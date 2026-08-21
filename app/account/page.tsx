import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SavedSummary } from '@/components/account/SavedSummary';
import { ORDER_HISTORY, SAVED_ADDRESSES, TRACKING_DONE, TRACKING_STAGES } from '@/lib/content';

/* Retired, kept on disk rather than deleted — no metadata export, so the tab
   title falls back to the root layout's instead of claiming a live page. */
export default function AccountPage() {
  notFound();

  return (
    <Section width={1100} pt={44} pb={90}>
      <Breadcrumb trail={[{ label: 'Головна', href: '/' }, { label: 'Кабінет' }]} />

      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 20,
          flexWrap: 'wrap',
        }}
      >
        <h1 style={{ fontSize: 44, margin: 0 }}>Доброго ранку, Ірино</h1>
        <Link
          href="/login"
          style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase' }}
        >
          Вийти
        </Link>
      </div>

      <div
        className="card"
        style={{ marginTop: 34, padding: 24, borderColor: 'var(--color-accent)' }}
      >
        <div className="kicker" style={{ color: 'var(--color-accent-700)' }}>
          У дорозі
        </div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 24, marginTop: 8 }}>
          Замовлення 4417 · Півонії та ранункулюси
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--color-neutral-700)', marginTop: 6 }}>
          Курʼєр Богдан виїхав з майстерні о 14:20. Прибуде на Шевченка 22 між 15:00 і 18:00.
        </div>

        {/* Four nodes: accent behind the completed stages, neutral ahead of them. */}
        <div style={{ display: 'flex', marginTop: 22, alignItems: 'center' }}>
          {TRACKING_STAGES.slice(1).map((stage, i) => (
            <div key={stage} style={{ display: 'contents' }}>
              <div className="rail-leg" data-done={i < TRACKING_DONE} />
              <div className="rail-dot" data-done={i < TRACKING_DONE} />
            </div>
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 11.5,
            color: 'var(--color-neutral-600)',
            marginTop: 8,
          }}
        >
          {TRACKING_STAGES.map((stage) => (
            <span key={stage}>{stage}</span>
          ))}
        </div>
      </div>

      <div style={{ margin: '48px 0 18px' }}>
        <SectionHeading size={28} marginBottom={0}>
          Історія замовлень
        </SectionHeading>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Замовлення</th>
            <th>Дата</th>
            <th>Склад</th>
            <th>Сума</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {ORDER_HISTORY.map((order) => (
            <tr key={order.id}>
              <td className="tabular">{order.id}</td>
              <td>{order.date}</td>
              <td>{order.items}</td>
              <td className="tabular">{order.total}</td>
              <td>
                <span
                  className={`tag ${order.status === 'У дорозі' ? 'tag-accent' : 'tag-neutral'}`}
                >
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
          gap: 32,
          marginTop: 52,
        }}
      >
        <div>
          <SectionHeading size={24} marginBottom={16}>
            Збережені адреси
          </SectionHeading>
          {SAVED_ADDRESSES.map((entry, i) => (
            <div
              key={entry.label}
              className="card"
              style={{ padding: 18, marginTop: i === 0 ? 0 : 12 }}
            >
              <div
                style={{
                  fontSize: 12,
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: 'var(--color-accent-700)',
                }}
              >
                {entry.label}
              </div>
              <div style={{ fontSize: 14, marginTop: 6, color: 'var(--color-neutral-700)' }}>
                {entry.address}
              </div>
            </div>
          ))}
        </div>

        <div>
          <SectionHeading size={24} marginBottom={16}>
            Улюблене
          </SectionHeading>
          <SavedSummary />
        </div>
      </div>
    </Section>
  );
}
