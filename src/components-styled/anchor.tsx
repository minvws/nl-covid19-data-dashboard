import React from 'react';

interface AnchorProps {
  text: string;
  name: string;
}

export function Anchor({ text, name }: AnchorProps) {
  return <a href={`#${name}`}>{text}</a>;
}
