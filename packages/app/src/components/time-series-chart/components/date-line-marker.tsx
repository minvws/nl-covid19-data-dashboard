import { colors, DateSpanValue, extractMonthFromDate, extractYearFromDate, formatStyle, isDateSpanValue, TimestampedValue } from '@corona-dashboard/common';
import { HoveredPoint } from '../logic';
import { space } from '~/style/theme';
import { useIntl } from '~/intl';
import css from '@styled-system/css';
import styled from 'styled-components';

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

export function DateLineMarker<T extends TimestampedValue>({ lineColor = colors.primary, point, value }: DateLineMarkerProps<T>) {
  const { formatDateFromSeconds } = useIntl();

  const getFormattedDate = (unixDate: number, format: formatStyle) => formatDateFromSeconds(unixDate, format);

  const getDateSpanValueDate = (value: DateSpanValue) => {
    const startDateMonth = extractMonthFromDate(value.date_start_unix);
    const startDateYear = extractYearFromDate(value.date_start_unix);

    const endDateMonth = extractMonthFromDate(value.date_end_unix);
    const endDateYear = extractYearFromDate(value.date_end_unix);

    if (startDateYear !== endDateYear) {
      return `${formatDateFromSeconds(value.date_start_unix, 'axis-with-day-month-year-short')} - ${formatDateFromSeconds(value.date_end_unix, 'axis-with-day-month-year-short')}`;
    } else if (startDateMonth !== endDateMonth) {
      return `${formatDateFromSeconds(value.date_start_unix, 'axis')} - ${formatDateFromSeconds(value.date_end_unix, 'axis-with-day-month-year-short')}`;
    } else {
      return `${formatDateFromSeconds(value.date_start_unix, 'day-only')} - ${formatDateFromSeconds(value.date_end_unix, 'axis-with-day-month-year-short')}`;
    }
  };

  const label = isDateSpanValue(value) ? getDateSpanValueDate(value) : getFormattedDate(point.seriesValue.__date_unix, 'axis-with-day-month-year-short');

  return (
    <Container style={{ transform: `translateX(${point.x}px)` }}>
      <Line color={lineColor} />
      <LabelContainer>
        <Label>{label}</Label>
      </LabelContainer>
    </Container>
  );
}

const LabelContainer = styled.div({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '7px',
  transform: 'translate(-50%, 0)',
  width: '100%',
});

const Label = styled.span(
  css({
    backgroundColor: 'white',
    paddingX: space[2],
    fontSize: 12,
    fontWeight: 'bold',
  })
);

const Line = styled.div<LineProps>((x) =>
  css({
    width: '1px',
    height: '100%',
    borderLeftWidth: '1px',
    borderLeftStyle: 'dashed',
    borderLeftColor: x.color,
  })
);

const Container = styled.div(
  css({
    position: 'absolute',
    pointerEvents: 'none',
    top: '0',
    bottom: '0',
  })
);
