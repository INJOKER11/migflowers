import type { CSSProperties, ReactNode } from 'react';

export type SectionWidth = 1240 | 1100 | 1000 | 900 | 800 | 760 | 720 | 660 | 440;

interface SectionProps {
  children: ReactNode;
  width?: SectionWidth;
  /** padding-top, px */
  pt?: number;
  /** padding-bottom, px */
  pb?: number;
  className?: string;
  style?: CSSProperties;
  id?: string;
}

export function Section({
  children,
  width = 1240,
  pt = 44,
  pb = 90,
  className,
  style,
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={className ? `section ${className}` : 'section'}
      style={{ maxWidth: width, paddingTop: pt, paddingBottom: pb, ...style }}
    >
      {children}
    </section>
  );
}
