import * as React from 'react';

interface LegendProps {
  children: React.ReactNode;
}

/*
 * Takes `li` elements as children.
 * Use `.blue` and `.gray` to add list marker colors to a list item.
 */
export function Legenda(props: LegendProps) {
  const { children } = props;
  return <ul className="legenda">{children}</ul>;
}
