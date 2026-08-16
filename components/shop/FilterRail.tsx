'use client';

import { Button } from '@/components/ui/Button';
import { Chip, ChipRow } from '@/components/ui/Chip';
import { uah } from '@/lib/format';
import {
  COLOR_FILTERS,
  OCCASION_FILTERS,
  PRICE_MAX,
  PRICE_MIN,
  PRICE_STEP,
  TYPE_FILTERS,
} from '@/lib/catalog';

interface FilterRailProps {
  occasion: string;
  type: string;
  color: string;
  priceCap: number;
  onOccasion: (value: string) => void;
  onType: (value: string) => void;
  onColor: (value: string) => void;
  onPriceCap: (value: number) => void;
  onClear: () => void;
}

function Group({
  label,
  options,
  current,
  onPick,
}: {
  label: string;
  options: readonly string[];
  current: string;
  onPick: (value: string) => void;
}) {
  return (
    <>
      <div className="kicker" style={{ marginBottom: 12 }}>
        {label}
      </div>
      <ChipRow>
        {options.map((option) => (
          <Chip key={option} active={option === current} onClick={() => onPick(option)}>
            {option}
          </Chip>
        ))}
      </ChipRow>
    </>
  );
}

export function FilterRail({
  occasion,
  type,
  color,
  priceCap,
  onOccasion,
  onType,
  onColor,
  onPriceCap,
  onClear,
}: FilterRailProps) {
  return (
    <aside data-sticky style={{ maxWidth: 280, position: 'sticky', top: 100 }}>
      <Group label="Категорія" options={OCCASION_FILTERS} current={occasion} onPick={onOccasion} />

      <div className="hr" style={{ margin: '24px 0' }} />
      <Group label="Вид квітів" options={TYPE_FILTERS} current={type} onPick={onType} />

      {/*<div className="hr" style={{ margin: '24px 0' }} />*/}
      {/*<Group label="Колір" options={COLOR_FILTERS} current={color} onPick={onColor} />*/}

      <div className="hr" style={{ margin: '24px 0' }} />
      <label className="kicker" htmlFor="price-cap" style={{ display: 'block', marginBottom: 12 }}>
        До {uah(priceCap)}
      </label>
      <input
        id="price-cap"
        type="range"
        min={PRICE_MIN}
        max={PRICE_MAX}
        step={PRICE_STEP}
        value={priceCap}
        onChange={(e) => onPriceCap(Number(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--color-accent)' }}
      />

      <Button
        variant="ghost"
        block
        cta="sm"
        style={{ marginTop: 24, padding: '9px 0' }}
        onClick={onClear}
      >
        Скинути фільтри
      </Button>
    </aside>
  );
}
