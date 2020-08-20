import Masonry from 'react-masonry-css';
import { WithChildren } from 'types';

const breakpointColumnsObj = {
  default: 2,
  1100: 2,
  600: 1,
};

export default MasonryLayout;

function MasonryLayout(props: WithChildren) {
  const { children } = props;

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="masonry-grid"
      columnClassName="masonry-grid-column"
    >
      {children}
    </Masonry>
  );
}
