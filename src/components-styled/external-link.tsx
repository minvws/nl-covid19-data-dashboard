import React from 'react';
import { Text, TextProps } from './typography';

interface ExternalLinkProps extends TextProps {
  text: string;
  href: string;
}

export function ExternalLink({ text, href, ...textProps }: ExternalLinkProps) {
  return (
    <Text
      as="a"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      {...(textProps as any)}
    >
      {text}
    </Text>
  );
}
