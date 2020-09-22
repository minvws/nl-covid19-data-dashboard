import * as React from 'react';
import { WithChildren } from 'types';

/*
 * Takes `li` elements as children.
 * Use `.blue` and `.gray` to add list marker colors to a list item.
 */
export function Legenda({ children }: WithChildren) {
  return <ul className="legenda">{children}</ul>;
}
