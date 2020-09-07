import { ParentSize } from '@vx/responsive';
import Municipalities from './choropleth';

export default function Choropleth() {
  return (
    <>
      <ParentSize>
        {({ width, height }) => (
          <Municipalities events width={width} height={height} />
        )}
      </ParentSize>
    </>
  );
}
