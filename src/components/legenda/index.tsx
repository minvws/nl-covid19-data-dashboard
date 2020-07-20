import * as React from 'react';

/*
 * Takes `li` elements as children.
 * Use `.blue` and `.gray` to add list marker colors to a list item.
 */
const Legenda: React.FC = (props) => {
  const { children } = props;

  return <ul className="legenda">{children}</ul>;
};

export default Legenda;
