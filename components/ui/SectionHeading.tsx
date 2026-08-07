import type { ReactNode } from 'react';

interface SectionHeadingProps {
  children: ReactNode;
  trailing?: ReactNode;
  size?: number;
  as?: 'h2' | 'h3';
  marginBottom?: number;
}

export function SectionHeading({
  children,
  trailing,
  size = 34,
  as: Tag = 'h2',
  marginBottom = 26,
}: SectionHeadingProps) {
  return (
    <div className="heading-row" style={{ marginBottom }}>
      <Tag style={{ fontSize: size, margin: 0 }}>{children}</Tag>
      <div className="hairline" />
      {trailing}
    </div>
  );
}
