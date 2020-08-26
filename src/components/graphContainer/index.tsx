import React from 'react';
import { WithChildren } from 'types';

function GraphContainer({ children }: WithChildren) {
  return <div className="graphContainer">{children}</div>;
}

export default GraphContainer;
