import {
  DateSpanValue,
  isDateSpanValue,
  TimestampedValue,
} from '@corona-dashboard/common';
import styled from 'styled-components';
import { Box } from '~/components-styled/base';
import { colors } from '~/style/theme';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { HoveredPoint } from '../logic';

type LineProps = {
  color: string;
};

const LabelContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 7px;
  transform: translate(-50%, 0);
  width: 100px;
`;

const Label = styled.span`
  background-color: white;
  padding-left: 0.5em;
  padding-right: 0.5em;
  font-size: 12px;
  font-weight: bold;
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

interface DateLineMarkerProps<T extends TimestampedValue> {
  point: HoveredPoint<T>;
  lineColor?: string;
  /**
   * The original data value gets passed in so that we can render the original
   * date start/end in case of the data span value
   */
  value: T;
}

export function DateLineMarker<T extends TimestampedValue>({
  lineColor = colors.data.primary,
  point,
  value,
}: DateLineMarkerProps<T>) {
  const isDateSpan = isDateSpanValue(value);

  return (
    <Container
      style={{
        left: point.x,
      }}
    >
      <Line color={lineColor} />
      <LabelContainer>
        <Label>
          {isDateSpan
            ? `${formatDateFromSeconds(
                (value as DateSpanValue).date_start_unix,
                'axis'
              )} - ${formatDateFromSeconds(
                (value as DateSpanValue).date_end_unix,
                'axis'
              )}`
            : formatDateFromSeconds(point.seriesValue.__date_unix, 'axis')}
        </Label>
      </LabelContainer>
    </Container>
  );
}
