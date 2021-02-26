import { TimestampedValue } from '@corona-dashboard/common';
import styled from 'styled-components';
import { Text } from '~/components-styled/typography';
import { colors } from '~/style/theme';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { HoveredPoint } from '../logic';

type LineProps = {
  color: string;
};

const Label = styled.div`
  background-color: white;
  margin-top: 7px;
  transform: translate(-50%, 0);
  padding-left: 0.5em;
  padding-right: 0.5em;
`;

const Line = styled.div<LineProps>`
  width: 1px;
  height: 100%;
  border-left-width: 1px;
  border-left-style: dashed;
  border-left-color: ${(props) => props.color};
`;

const Container = styled.div`
  position: absolute;
  pointer-events: none;
  top: 0;
  bottom: 0;
`;

interface DateMarkerProps<T extends TimestampedValue> {
  point: HoveredPoint<T>;
  lineColor?: string;
}

export function DateMarker<T extends TimestampedValue>({
  lineColor = colors.data.primary,
  point,
}: DateMarkerProps<T>) {
  return (
    <Container
      style={{
        left: point.x,
      }}
    >
      <Line color={lineColor} />
      <Label>
        <Text fontSize={12} fontWeight="bold" m={0}>
          {formatDateFromSeconds(point.trendValue.__date_unix, 'axis')}
        </Text>
      </Label>
    </Container>
  );
}
