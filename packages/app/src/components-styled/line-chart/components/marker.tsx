import { TimestampedValue } from '@corona-dashboard/common';
import styled from 'styled-components';
import { ChartPadding } from '~/components-styled/line-chart/components';
import { Text } from '~/components-styled/typography';
import { colors } from '~/style/theme';
import { useIntl } from '~/intl';
import { TrendValue } from '../logic';

const MARKER_POINT_SIZE = 18;

export type HoverPoint<T extends TimestampedValue> = {
  data: T & TrendValue;
  color?: string;
  x: number;
  y: number;
};

type ColorProps = {
  indicatorColor: string;
};

const Label = styled.div`
  pointer-events: none;
  background-color: white;
  min-width: 4em;
  text-align: center;
`;

const DottedLine = styled.div<ColorProps>`
  position: absolute;
  pointer-events: none;
  width: 1px;
  border-left-width: 1px;
  border-left-style: dashed;
  border-left-color: ${(props) => props.indicatorColor || 'black'};
`;

const Point = styled.div<ColorProps>`
  pointer-events: none;
  position: relative;
  height: 18px;
  width: 18px;

  &::after {
    content: '';
    position: absolute;
    height: 8px;
    width: 8px;
    transform: translate(50%, -50%);
    border-radius: 50%;
    border: 1px solid white;
    background: ${(props) => props.indicatorColor || 'black'};
  }

  &::before {
    content: '';
    position: absolute;
    height: 18px;
    width: 18px;
    /*
      Without the -5% the outer circle is a little off for some reason
    */
    transform: translate(-5%, -50%);
    border-radius: 50%;
    background: ${(props) => props.indicatorColor || 'black'};
    opacity: 0.2;
  }
`;

const DateSpanMarker = styled.div`
  pointer-events: none;
  transform: translate(-50%, 0);
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 0;
  flex-shrink: 0;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.03);
`;

const LineContainer = styled.div`
  pointer-events: none;
  transform: translate(-50%, 0);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
`;

type MarkerProps<T extends TimestampedValue> = {
  data: HoverPoint<T>[];
  dateSpanWidth: number;
  primaryColor?: string;
  showLine?: boolean;
  formatLabel?: (data: T & TrendValue) => string;
  padding: ChartPadding;
  height: number;
};

export function Marker<T extends TimestampedValue>(props: MarkerProps<T>) {
  const { formatDateFromMilliseconds } = useIntl();

  function defaultFormatLabel<T>(data: T & TrendValue): string {
    return formatDateFromMilliseconds(data.__date.getTime(), 'axis');
  }

  const {
    primaryColor = colors.data.primary,
    data,
    showLine = false,
    formatLabel = defaultFormatLabel,
    dateSpanWidth,
    height,
    padding,
  } = props;

  const topY = data.reduce((min, d) => {
    return Math.min(d.y, min);
  }, Infinity);

  return (
    <>
      {/**
       * Inline styles here are use deliberately, because using styled components
       * with dynamic props will inject classes into the css at runtime, which is
       * not super efficient in case of hover events.
       */}
      {showLine && (
        <LineContainer
          style={{
            top: 'calc(100% + 5px)',
            // -1 makes it align better, not sure why
            left: data[0].x - 1,
          }}
        >
          <DottedLine
            indicatorColor={primaryColor}
            style={{
              // +10 makes it align better, not sure why
              bottom: padding.top + 10,
              height: `${height - topY - (padding.top + padding.bottom)}px`,
            }}
          />
          <Label>
            <Text fontSize={12} fontWeight="bold" m={0}>
              {formatLabel(data[0].data)}
            </Text>
          </Label>
        </LineContainer>
      )}
      <DateSpanMarker
        style={{
          width: dateSpanWidth,
          left: data[0].x,
        }}
      >
        {data.map((d, index) => (
          <Point
            indicatorColor={d.color ?? colors.data.primary}
            style={{ top: d.y - index * MARKER_POINT_SIZE }}
            key={index}
          />
        ))}
      </DateSpanMarker>
    </>
  );
}
