import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
};

interface ButtonStyleProps {
  children?: ReactNode;
  variant?: ButtonVariant;
  block?: boolean;
  icon?: boolean;
  /**
   * The micro-caps call-to-action treatment: uppercase, tracked out, 12px.
   * `cta="sm"` is the 11.5px cut the secondary actions use — reset filters,
   * back to basket, remove from wishlist.
   */
  cta?: boolean | 'sm';
  className?: string;
}

type ButtonAsButton = ButtonStyleProps &
  Omit<ComponentProps<'button'>, keyof ButtonStyleProps> & { href?: undefined };

type ButtonAsLink = ButtonStyleProps &
  Omit<ComponentProps<typeof Link>, keyof ButtonStyleProps> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = 'primary',
  block,
  icon,
  cta,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = ['btn', VARIANT_CLASS[variant]];
  if (block) classes.push('btn-block');
  if (icon) classes.push('btn-icon');
  if (cta) classes.push('btn-cta');
  if (cta === 'sm') classes.push('btn-cta-sm');
  if (className) classes.push(className);
  const cls = classes.join(' ');

  if (rest.href !== undefined) {
    const { href, ...linkProps } = rest;
    return (
      <Link href={href} className={cls} {...linkProps}>
        {children}
      </Link>
    );
  }

  const { type = 'button', ...buttonProps } = rest;
  return (
    <button type={type} className={cls} {...buttonProps}>
      {children}
    </button>
  );
}
