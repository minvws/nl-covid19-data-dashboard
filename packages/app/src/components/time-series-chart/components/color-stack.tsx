import { PositionScale } from '@visx/shape/lib/types';
import { Bounds, SplitPoint } from '../logic';

export function ColorStack({
  id,
  splitPoints,
  bounds,
  yScale,
  fillOpacity,
}: {
  id: string;
  splitPoints: SplitPoint[];
  bounds: Bounds;
  yScale: PositionScale;
  fillOpacity?: number;
}) {
  /**
   * Convert the splitPoints into a vertical stack of colored segments. Since
   * coordinate 0,0 is top-left these calculations are a bit difficult to grasp
   * I think. Possibly it can be simplified.
   *
   * Split points only define one boundary, and build on the previous one, so we
   * need to keep track of the previous Y value while mapping them. Points are
   * expected to be sorted by value low to high in the split-area configuration.
   * Maybe we should sort them in code to make it fool-proof.
   */
  let previousY = bounds.height;

  return (
    <>
      {splitPoints.map((splitPoint) => {
        const segmentHeight = previousY - (yScale(splitPoint.value) || 0);
        const y = previousY - segmentHeight;
        const elem = (
          <rect
            key={splitPoint.label}
            x={0}
            y={y}
            width={bounds.width}
            height={segmentHeight}
            fill={splitPoint.color}
            clipPath={`url(#${id})`}
            opacity={fillOpacity}
          />
        );

        previousY = y;
        return elem;
      })}
    </>
  );
}
