'use client';

import { STROKE, Trash2 } from '@/components/ui/icons';

interface QuantityStepperProps {
  qty: number;
  onDecrease: () => void;
  onIncrease: () => void;
  size?: 28 | 30;
  label: string;
  block?: boolean;
}

export function QuantityStepper({
  qty,
  onDecrease,
  onIncrease,
  size = 30,
  label,
  block = false,
}: QuantityStepperProps) {
  const box = block ? undefined : { width: size, height: size, fontSize: size === 28 ? 15 : 16 };

  const removes = block && qty === 1;

  return (
    <div className={block ? 'stepper stepper-block' : 'stepper'}>
      <button
        type="button"
        onClick={onDecrease}
        title={removes ? 'Видалити' : 'Менше'}
        aria-label={`${removes ? 'Видалити' : 'Менше'}: ${label}`}
        style={box}
      >
        {removes ? <Trash2 size={15} strokeWidth={STROKE} /> : '−'}
      </button>
      <span className="tabular" style={block ? undefined : { minWidth: size === 28 ? 18 : 20 }}>
        {qty}
        {block && <span className="stepper-unit">шт.</span>}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        title="Більше"
        aria-label={`Більше: ${label}`}
        style={box}
      >
        +
      </button>
    </div>
  );
}
