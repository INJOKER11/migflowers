import { Fragment } from 'react';
import { Link } from '@/components/ui/Link';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';
import type { Locale } from '@/lib/i18n';

export interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  trail: Crumb[];
  /**
   * Pass it and the trail is also emitted as `BreadcrumbList` structured data,
   * which is what puts the path (rather than a bare URL) under a Google result.
   * It is opt-in because the absolute URLs need a locale, and because
   * `loading.tsx` renders a placeholder trail that describes no real page.
   */
  locale?: Locale;
}

export function Breadcrumb({ trail, locale }: BreadcrumbProps) {
  return (
    <div className="breadcrumb">
      {locale && <JsonLd data={breadcrumbSchema(trail, locale)} />}
      {trail.map((crumb, i) => (
        <Fragment key={`${crumb.label}-${i}`}>
          {i > 0 && <>&nbsp;/&nbsp;</>}
          {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : crumb.label}
        </Fragment>
      ))}
    </div>
  );
}
