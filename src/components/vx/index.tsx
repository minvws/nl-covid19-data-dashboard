import ParentSize from './ParentSize';
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
