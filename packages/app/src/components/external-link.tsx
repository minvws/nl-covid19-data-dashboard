import React from 'react';
import { Anchor, AnchorProps } from './typography';

type ExternalLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
} & AnchorProps;

export function ExternalLink({
  href,
  children,
  className,
  ariaLabel,
  ...anchorProps
}: ExternalLinkProps) {
  return (
    <Anchor
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      className={className}
      aria-label={ariaLabel}
      {...anchorProps}
    >
      {children}
    </Anchor>
  );
}
