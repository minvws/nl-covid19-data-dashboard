import React from 'react';
import { Text } from './typography';

interface AnchorProps {
  text: string;
  name: string;
}

export function Anchor({ text, name }: AnchorProps) {
  return (
    <Text as="a" href={`#${name}`}>
      {text}
    </Text>
  );
}
