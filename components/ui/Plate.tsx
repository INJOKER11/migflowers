import Image from 'next/image';
import type { CSSProperties, ReactNode } from 'react';

interface PlateProps {
  src: string;
  alt: string;
  ratio?: string;
  sizes?: string;
  priority?: boolean;
  zoom?: number;
  zoomTime?: string;
  radius?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function Plate({
  src,
  alt,
  ratio = '1/1',
  sizes = '(max-width: 760px) 100vw, 33vw',
  priority = false,
  zoom,
  zoomTime = '0.6s',
  radius = 'var(--radius-md)',
  className,
  style,
  children,
}: PlateProps) {
  const classes = ['plate', 'plate-frame', zoom ? 'zoom' : null, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      style={
        {
          aspectRatio: ratio,
          borderRadius: radius,
          ...(zoom ? { '--zoom-scale': zoom, '--zoom-time': zoomTime } : null),
          ...style,
        } as CSSProperties
      }
    >
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} />
      {children}
    </div>
  );
}
