'use client';

import { STROKE, Trash2 } from '@/components/ui/icons';
import { useDict } from '@/lib/dictionary-context';
import { fill } from '@/lib/format';

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
  const t = useDict().cart;
  const box = block ? undefined : { width: size, height: size, fontSize: size === 28 ? 15 : 16 };

  const removes = block && qty === 1;

  return (
    <div className={block ? 'stepper stepper-block' : 'stepper'}>
      <button
        type="button"
        onClick={onDecrease}
        title={removes ? t.remove : t.less}
        aria-label={fill(t.stepperAria, { action: removes ? t.remove : t.less, name: label })}
        style={box}
      >
        {removes ? <Trash2 size={15} strokeWidth={STROKE} /> : '−'}
      </button>
      <span className="tabular" style={block ? undefined : { minWidth: size === 28 ? 18 : 20 }}>
        {qty}
        {block && <span className="stepper-unit">{t.unit}</span>}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        title={t.more}
        aria-label={fill(t.stepperAria, { action: t.more, name: label })}
        style={box}
      >
        +
      </button>
    </div>
  );
}
