import { colors, isDateSpanValue, TimestampedValue } from '@corona-dashboard/common';
import css from '@styled-system/css';
import styled from 'styled-components';
import { useIntl } from '~/intl';
import { space } from '~/style/theme';
import { HoveredPoint } from '../logic';

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
  return (
    <Container style={{ transform: `translateX(${point.x}px)` }}>
      <Line color={lineColor} />
      <LabelContainer>
        <Label>
          {isDateSpanValue(value) ? (
            <>
              {formatDateFromSeconds(value.date_start_unix, 'axis')}
              <> &ndash; </>
              {formatDateFromSeconds(value.date_end_unix, 'axis')}
            </>
          ) : (
            formatDateFromSeconds(point.seriesValue.__date_unix, 'axis')
          )}
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
  width: '100px',
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
