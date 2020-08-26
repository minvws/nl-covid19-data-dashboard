import { WithChildren } from 'types';

export default GraphContent;

function GraphContent({ children }: WithChildren) {
  return <div className="graphContent">{children}</div>;
}
