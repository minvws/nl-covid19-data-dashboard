import React from 'react';
import { Text } from './typography';

interface ExternalLinkProps {
  text: string;
  href: string;
}

export function ExternalLink({ text, href }: ExternalLinkProps) {
  return (
    <Text as="a" href={href} rel="noopener noreferrer" target="_blank">
      {text}
    </Text>
  );
}
