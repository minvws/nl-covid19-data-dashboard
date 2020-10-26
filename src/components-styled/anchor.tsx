import React from 'react';

interface AnchorProps {
  text: string;
  anchorName: string;
}

export function Anchor({ text, anchorName }: AnchorProps) {
  return <a href={`#${anchorName}`}>{text}</a>;
}
