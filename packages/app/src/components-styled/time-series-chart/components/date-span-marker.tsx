import styled from 'styled-components';
import { HoveredPoint } from '../logic/hover-state';

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

interface DateSpanMarkerProps {
  point: HoveredPoint;
  width: number;
}

export function DateSpanMarker(props: DateSpanMarkerProps) {
  const { point, width } = props;

  return (
    <Container
      style={{
        width,
        left: point.x,
      }}
    >
      <DateSpan />
    </Container>
  );
}
