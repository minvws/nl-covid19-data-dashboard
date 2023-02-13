import { TimestampedValue } from '@corona-dashboard/common';
import styled from 'styled-components';
import { HoveredPoint } from '../logic';

const DateSpan = styled.div`
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.03);
`;

const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  transform: translate(-50%, 0);
`;

interface DateSpanMarkerProps<T extends TimestampedValue> {
  point: HoveredPoint<T> | { x: number };
  width: number;
}

export function DateSpanMarker<T extends TimestampedValue>(props: DateSpanMarkerProps<T>) {
  const { point, width } = props;

  return (
    <Container
      style={{
        width,
        transform: `translateX(${point.x - width / 2 + 0.5}px)`,
      }}
    >
      <DateSpan />
    </Container>
  );
}
