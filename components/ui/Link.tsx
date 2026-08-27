'use client';

import NextLink from 'next/link';
import type { ComponentProps } from 'react';
import { useLocalePath } from '@/lib/use-locale';

type LinkProps = ComponentProps<typeof NextLink>;

export function Link({ href, ...rest }: LinkProps) {
  const withLocale = useLocalePath();

  const target = typeof href === 'string' && href.startsWith('/') ? withLocale(href) : href;

  return <NextLink href={target} {...rest} />;
}
