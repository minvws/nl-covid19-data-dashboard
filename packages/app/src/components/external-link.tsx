import React from 'react';
import { Anchor, AnchorProps } from './typography';
import { useIntl } from '~/intl';

type ExternalLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
} & AnchorProps;

export function ExternalLink({ href, children, className, ariaLabel, ...anchorProps }: ExternalLinkProps) {
  const { commonTexts } = useIntl();
  const ExternalLinkAriaLabel = ariaLabel || commonTexts.accessibility.visual_context_labels.external_link;

  return (
    <Anchor href={href} rel="noopener noreferrer" target="_blank" className={className} aria-label={ExternalLinkAriaLabel} {...anchorProps}>
      {children}
    </Anchor>
  );
}
