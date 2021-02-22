import styled from 'styled-components';
import { ChartPadding } from '~/components-styled/line-chart/components';
import { TrendValue } from '~/components-styled/line-chart/logic';
import { Text } from '~/components-styled/typography';
import { colors } from '~/style/theme';
import { formatDateFromMilliseconds } from '~/utils/formatDate';

const MARKER_POINT_SIZE = 18;

export type HoveredPoint = {
  trendValue: TrendValue;
  trendValueIndex: number;
  seriesConfigIndex: number;
  color: string;
  x: number;
  y: number;
};

type ColorProps = {
  color: string;
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
  border-left-color: ${(props) => props.color};
`;

const PointMarker = styled.div<ColorProps>`
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
    background: ${(props) => props.color};
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
    background: ${(props) => props.color};
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

interface MarkersProps {
  hoveredPoints: HoveredPoint[];
  dateSpanWidth: number;
  lineColor?: string;
  showLine?: boolean;
  formatLabel?: (value: TrendValue) => string;
  padding: ChartPadding;
  height: number;
}

/**
 * @TODO this component might be better split up into different kinds of
 * markers. It feels like there are currently too many different concerns
 * involved.
 */
export function Markers(props: MarkersProps) {
  const {
    lineColor = colors.data.primary,
    hoveredPoints,
    showLine = false,
    formatLabel = defaultFormatLabel,
    dateSpanWidth,
    height,
    padding,
  } = props;

  const topY = hoveredPoints.reduce((min, d) => {
    return Math.min(d.y, min);
  }, Infinity);

  const firstPoint = hoveredPoints[0];

  // console.log('+++ firstPoint', firstPoint);

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
            left: firstPoint.x - 1,
          }}
        >
          <DottedLine
            color={lineColor}
            style={{
              // +10 makes it align better, not sure why
              bottom: padding.top + 10,
              height: `${height - topY - (padding.top + padding.bottom)}px`,
            }}
          />
          <Label>
            <Text fontSize={12} fontWeight="bold" m={0}>
              {formatLabel(firstPoint.trendValue)}
            </Text>
          </Label>
        </LineContainer>
      )}
      <DateSpanMarker
        style={{
          width: dateSpanWidth,
          left: firstPoint.x,
        }}
      >
        {hoveredPoints.map((point, index) => (
          <PointMarker
            color={point.color}
            style={{ top: point.y - index * MARKER_POINT_SIZE }}
            key={point.y}
          />
        ))}
      </DateSpanMarker>
    </>
  );
}

function defaultFormatLabel<T>(data: T & TrendValue): string {
  return formatDateFromMilliseconds(data.__date.getTime(), 'axis');
}
