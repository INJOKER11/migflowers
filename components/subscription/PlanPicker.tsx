'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CADENCES, PLANS, RECOMMENDED_PLAN_INDEX } from '@/lib/content';
import { roundTo10, uah } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { Chip, ChipRow } from '@/components/ui/Chip';

export function PlanPicker() {
  const router = useRouter();
  const [cadenceIndex, setCadenceIndex] = useState(0);
  const cadence = CADENCES[cadenceIndex];

  return (
    <>
      <div style={{ margin: '28px 0 32px' }}>
        <ChipRow>
          {CADENCES.map((c, i) => (
            <Chip
              key={c.label}
              size="cadence"
              active={i === cadenceIndex}
              onClick={() => setCadenceIndex(i)}
            >
              {c.label}
            </Chip>
          ))}
        </ChipRow>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
          gap: 24,
        }}
      >
        {PLANS.map((plan, i) => (
          <div
            key={plan.name}
            className="card"
            style={{
              padding: 28,
              borderColor:
                i === RECOMMENDED_PLAN_INDEX ? 'var(--color-accent)' : 'var(--color-divider)',
            }}
          >
            <div className="kicker" style={{ color: 'var(--color-accent-700)' }}>
              {plan.tier}
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 30, marginTop: 10 }}>
              {plan.name}
            </div>
            <div
              className="tabular"
              style={{ fontFamily: 'var(--font-heading)', fontSize: 38, marginTop: 14 }}
            >
              {uah(roundTo10(plan.base * cadence.mult))}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--color-neutral-600)', marginTop: 2 }}>
              за доставку, {cadence.per}
            </div>

            <div className="hr" style={{ margin: '20px 0' }} />

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 9,
                fontSize: 14,
                color: 'var(--color-neutral-700)',
              }}
            >
              {plan.features.map((feature) => (
                <span key={feature}>{feature}</span>
              ))}
            </div>

            <Button
              block
              cta="sm"
              style={{ marginTop: 24, padding: '12px 0' }}
              onClick={() => router.push('/checkout')}
            >
              Обрати цей план
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
