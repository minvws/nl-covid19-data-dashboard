import * as React from 'react';
import { WithChildren } from 'types';

export default Legenda;

/*
 * Takes `li` elements as children.
 * Use `.blue` and `.gray` to add list marker colors to a list item.
 */
function Legenda({ children }: WithChildren) {
  return <ul className="legenda">{children}</ul>;
}
