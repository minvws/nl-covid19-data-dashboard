import React from 'react';
import { WithChildren } from 'types';

export default GraphContainer;

function GraphContainer({ children }: WithChildren) {
  return <div className="graphContainer">{children}</div>;
}
