import {
  DateSpanValue,
  isDateSpanValue,
  TimestampedValue,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import styled from 'styled-components';
import { colors } from '~/style/theme';
import { HoveredPoint } from '../logic';
import { useIntl } from '~/intl';

type LineProps = {
  color: string;
};

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
  const { formatDateFromSeconds } = useIntl();

  return (
    <Container style={{ transform: `translateX(${point.x}px)` }}>
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

const LabelContainer = styled.div({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '7px',
  transform: 'translate(-50%, 0)',
  width: 100,
});

const Label = styled.span(
  css({
    backgroundColor: 'white',
    px: '0.5em',
    fontSize: 12,
    fontWeight: 'bold',
  })
);

const Line = styled.div<LineProps>(
  css({
    width: '1px',
    height: '100%',
    borderLeftWidth: '1px',
    borderLeftStyle: 'dashed',
    borderLeftColor: (props) => props.color,
  })
);

const Container = styled.div(
  css({
    position: 'absolute',
    pointerEvents: 'none',
    top: 0,
    bottom: 0,
  })
);
