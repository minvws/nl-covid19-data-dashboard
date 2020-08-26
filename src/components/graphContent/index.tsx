import { WithChildren } from 'types';

function GraphContent({ children }: WithChildren) {
  return <div className="graphContent">{children}</div>;
}

export default GraphContent;
