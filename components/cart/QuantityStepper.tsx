'use client';

interface QuantityStepperProps {
  qty: number;
  onDecrease: () => void;
  onIncrease: () => void;
  size?: 28 | 30;
  label: string;
}

export function QuantityStepper({
  qty,
  onDecrease,
  onIncrease,
  size = 30,
  label,
}: QuantityStepperProps) {
  const box = { width: size, height: size, fontSize: size === 28 ? 15 : 16 };
  return (
    <div className="stepper">
      <button type="button" onClick={onDecrease} title="Менше" aria-label={`Менше: ${label}`} style={box}>
        −
      </button>
      <span className="tabular" style={{ minWidth: size === 28 ? 18 : 20 }}>
        {qty}
      </span>
      <button type="button" onClick={onIncrease} title="Більше" aria-label={`Більше: ${label}`} style={box}>
        +
      </button>
    </div>
  );
}
