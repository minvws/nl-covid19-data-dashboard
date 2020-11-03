import React from 'react';

interface ExternalLinkProps {
  text: string;
  href: string;
}

export function ExternalLink({ text, href }: ExternalLinkProps) {
  return (
    <a href={href} rel="noopener noreferrer" target="_blank">
      {text}
    </a>
  );
}
