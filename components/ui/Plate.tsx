import Image from 'next/image';
import type { CSSProperties, ReactNode } from 'react';

interface PlateProps {
  /* null when the API has no photograph for this product or category yet —
     the mat is drawn empty rather than falling back to stock, which would
     show a customer an arrangement that isn't the one they're buying. */
  src: string | null;
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
      {src === null ? (
        <div className="plate-empty" role="img" aria-label={alt}>
          <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <ellipse cx="24" cy="12" rx="4" ry="6" />
              <ellipse cx="24" cy="12" rx="4" ry="6" transform="rotate(72 24 18)" />
              <ellipse cx="24" cy="12" rx="4" ry="6" transform="rotate(144 24 18)" />
              <ellipse cx="24" cy="12" rx="4" ry="6" transform="rotate(216 24 18)" />
              <ellipse cx="24" cy="12" rx="4" ry="6" transform="rotate(288 24 18)" />
              <circle cx="24" cy="18" r="2.5" />
              <path d="M24 28V44" />
              <path d="M24 35C19 35 16 32 16 29c4 0 8 2 8 6Z" />
              <path d="M24 39c5 0 8-3 8-6-4 0-8 2-8 6Z" />
            </g>
          </svg>
        </div>
      ) : (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} />
      )}
      {children}
    </div>
  );
}
