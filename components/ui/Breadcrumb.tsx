import Link from 'next/link';
import { Fragment } from 'react';

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ trail }: { trail: Crumb[] }) {
  return (
    <div className="breadcrumb">
      {trail.map((crumb, i) => (
        <Fragment key={`${crumb.label}-${i}`}>
          {i > 0 && <>&nbsp;/&nbsp;</>}
          {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : crumb.label}
        </Fragment>
      ))}
    </div>
  );
}
