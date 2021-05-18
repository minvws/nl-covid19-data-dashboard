import { Group } from '@visx/group';
import { Bar, Line } from '@visx/shape';
import { Text } from '@visx/text';
import { useIntl } from '~/intl';
import theme, { colors } from '~/style/theme';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { GetX, TimespanAnnotationConfig } from '../logic';

const DEFAULT_COLOR = colors.data.underReported;

export function TimespanAnnotation({
  domain,
  getX,
  height,
  chartId,
  config,
}: {
  domain: [number, number];
  height: number;
  getX: GetX;
  chartId: string;
  config: TimespanAnnotationConfig;
}) {
  const [min, max] = domain;
  const { start, end } = config;

  const breakpoints = useBreakpoints(true);
  const { siteText } = useIntl();

  /**
   * Clip the start / end dates to the domain of the x-axis, so that we can
   * conveniently pass in things like Infinity for end date.
   */
  const clippedStart = Math.max(start, min);
  const clippedEnd = Math.min(end, max);

  const x0 = getX({ __date_unix: clippedStart });
  const x1 = getX({ __date_unix: clippedEnd });

  /**
   * Here we do not have to calculate where the dates fall on the x-axis because
   * the unix timestamps are used directly for the xScale.
   */
  const width = x1 - x0;

  const fontSize = !breakpoints.lg ? theme.fontSizes[0] : theme.fontSizes[1];

  if (width <= 0) return null;

  switch (config.type) {
    case 'bar':
      return (
        <Bar
          pointerEvents="none"
          height={height}
          x={x0}
          width={width}
          fill={colors.data.underReported}
          opacity={1}
          style={{ mixBlendMode: 'multiply' }}
        />
      );
    case 'estimate':
      return (
        <>
          <Bar
            pointerEvents="none"
            height={height}
            x={x0}
            width={width}
            fill={`url(#${chartId}_estimate_pattern)`}
          />
          <Group>
            <Text
              fontSize={fontSize}
              x={x0 - 15}
              y={15}
              textAnchor="end"
              fill="grey"
            >
              {config.leftLabel}
            </Text>
            <Text
              fontSize={fontSize}
              x={x0 + 15}
              y={15}
              textAnchor="start"
              fill="grey"
            >
              {config.rightLabel}
            </Text>

            <Line
              x1={x0}
              x2={x0}
              y1={height}
              y2={0}
              stroke="grey"
              strokeWidth="2"
            />
          </Group>
        </>
      );
  }
}

interface TimespanAnnotationIconProps {
  fillOpacity?: number;
  width?: number;
  height?: number;
}

export function TimespanAnnotationIcon({
  width = 15,
  height = 15,
}: TimespanAnnotationIconProps) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={DEFAULT_COLOR}
        opacity={1}
        rx={2}
        style={{ mixBlendMode: 'multiply' }}
      />
    </svg>
  );
}
