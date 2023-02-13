import { TimestampedValue } from '@corona-dashboard/common';
import { transparentize } from 'polished';
import styled from 'styled-components';
import { HoveredPoint } from '../logic';

const MARKER_POINT_SIZE = 9;

type MarkerProps = {
  color: string;
  size: number;
};

interface PointMarkerProps<T extends TimestampedValue> {
  points: HoveredPoint<T>[];
}

export function PointMarkers<T extends TimestampedValue>(props: PointMarkerProps<T>) {
  const size = MARKER_POINT_SIZE;
  const { points } = props;

  if (!points.length) return null;

  const offsetX = points[0].x - Math.floor(size / 2);

  return (
    <Container
      style={{
        transform: `translateX(${offsetX}px)`,
        width: size,
      }}
    >
      {points
        .filter((p) => !p.noMarker)
        .map((point, index) => (
          <PointMarker
            color={point.color}
            size={size}
            /**
             * Dynamic properties like y position are set via inline style because
             * SC would dynamically generate and inject a new class for every position
             */
            style={{
              transform: `translateY(${point.y - Math.floor(size / 2)}px)`,
            }}
            key={index}
          />
        ))
        .reverse()}
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
`;

const PointMarker = styled.div<MarkerProps>`
  position: absolute;
  height: ${(x) => x.size}px;
  width: ${(x) => x.size}px;
  border-radius: 50%;
  border: 1px solid white;
  background: ${(props) => props.color};

  box-shadow: 0 0 0 ${(x) => x.size / 2}px ${(x) => transparentize(0.6, x.color)};
`;
