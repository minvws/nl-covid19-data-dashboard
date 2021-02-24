import React from 'react';
import { assert } from '~/utils/assert';
interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

export function ExternalLink({
  href,
  children,
  className,
  ariaLabel,
}: ExternalLinkProps) {
  if (ariaLabel || 0 === ariaLabel?.length)
    assert(
      ariaLabel.length > 0,
      'When adding an ariaLabel props, please include some valid text for it'
    );

  return (
    <a
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
