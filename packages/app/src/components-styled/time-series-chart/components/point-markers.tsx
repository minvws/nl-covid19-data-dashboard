import { TimestampedValue } from '@corona-dashboard/common';
import styled from 'styled-components';
import { HoveredPoint } from '../logic/hover-state';

const MARKER_POINT_SIZE = 18;

type MarkerProps = {
  color: string;
  size: number;
};

const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  transform: translate(-50%, 0);
`;

const PointMarker = styled.div<MarkerProps>`
  position: absolute;

  &::after {
    content: '';
    position: absolute;
    height: 8px;
    width: 8px;
    transform: translate(50%, -50%);
    border-radius: 50%;
    border: 1px solid white;
    background: ${(props) => props.color};
  }

  &::before {
    content: '';
    position: absolute;
    height: ${(props) => props.size}px;
    width: ${(props) => props.size}px;
    /*
      Without the -5% the outer circle is a little off for some reason
    */
    transform: translate(-5%, -50%);
    border-radius: 50%;
    background: ${(props) => props.color};
    opacity: 0.4;
  }
`;

interface PointMarkerProps<T extends TimestampedValue> {
  points: HoveredPoint<T>[];
  size?: number;
}

export function PointMarkers<T extends TimestampedValue>(
  props: PointMarkerProps<T>
) {
  const { points, size = MARKER_POINT_SIZE } = props;

  if (!points.length) return null;

  return (
    <Container
      style={{
        /**
         * Not sure why we need +1 to align them with LineMarker
         */
        left: points[0].x + 1,
        width: size,
      }}
    >
      {points.map((point, index) => (
        <PointMarker
          color={point.color}
          size={size}
          /**
           * Dynamic properties like y position are set via inline style because
           * SC would dynamically generate and inject a new class for every position
           */
          style={{ top: point.y }}
          key={index}
        />
      ))}
    </Container>
  );
}
