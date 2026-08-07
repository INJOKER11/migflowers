'use client';

import type { ReactNode } from 'react';

export type ChipSize = 'sm' | 'lg' | 'xl' | 'variant' | 'cadence';

const SIZE_CLASS: Record<ChipSize, string> = {
  sm: '',
  lg: 'chip-lg',
  xl: 'chip-xl',
  variant: 'chip-variant',
  cadence: 'chip-cadence',
};

interface ChipProps {
  children: ReactNode;
  active: boolean;
  onClick: () => void;
  size?: ChipSize;
  className?: string;
}

export function Chip({ children, active, onClick, size = 'sm', className }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={['chip', SIZE_CLASS[size], className].filter(Boolean).join(' ')}
    >
      {children}
    </button>
  );
}

export function ChipRow({ children }: { children: ReactNode }) {
  return <div className="chip-row">{children}</div>;
}
