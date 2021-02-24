import styled from 'styled-components';
import { TrendValue } from '~/components-styled/line-chart/logic';
import { Text } from '~/components-styled/typography';
import { colors } from '~/style/theme';
import { formatDateFromMilliseconds } from '~/utils/formatDate';
import { HoveredPoint } from '../logic/hover-state';

type LineProps = {
  color: string;
};

const Label = styled.div`
  background-color: white;
  margin-top: 7px;
  transform: translate(-50%, 0);
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

interface LineMarkerProps {
  point: HoveredPoint;
  lineColor?: string;
}

export function LineMarker({
  lineColor = colors.data.primary,
  point,
}: LineMarkerProps) {
  return (
    <Container
      style={{
        left: point.x,
      }}
    >
      <Line color={lineColor} />
      <Label>
        <Text fontSize={12} fontWeight="bold" m={0}>
          {formatLabel(point.trendValue)}
        </Text>
      </Label>
    </Container>
  );
}

function formatLabel(value: TrendValue) {
  return formatDateFromMilliseconds(value.__date.getTime(), 'axis');
}
