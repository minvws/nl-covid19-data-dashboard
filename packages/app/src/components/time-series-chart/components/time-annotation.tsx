import { Group } from '@visx/group';
import { Line } from '@visx/shape';
import { Text } from '@visx/text';
import theme, { colors } from '~/style/theme';
import { GetX, TimeAnnotationConfig } from '../logic';
import { useChartBreakpoints } from '../logic/use-chart-breakpoints';

export function TimeAnnotation({
  domain,
  getX,
  height,
  config,
  chartWidth,
}: {
  domain: [number, number];
  height: number;
  getX: GetX;
  config: TimeAnnotationConfig;
  chartWidth: number;
}) {
  const [min, max] = domain;
  const { position } = config;

  const chartBreakpoints = useChartBreakpoints(chartWidth);

  if (position < min || position > max) {
    return null;
  }

  const x = getX({ __date_unix: position });

  const fontSize = !chartBreakpoints.md
    ? theme.fontSizes[0]
    : theme.fontSizes[1];

  const leftAngle = chartBreakpoints.md ? 0 : -90;
  const rightRotate = chartBreakpoints.md ? 0 : 90;

  switch (config.type) {
    case 'divider':
      return (
        <Group>
          <Text
            fontSize={fontSize}
            x={x - 10}
            y={15}
            textAnchor="end"
            fill={colors.gray}
            angle={leftAngle}
          >
            {config.leftLabel}
          </Text>
          <Text
            fontSize={fontSize}
            x={x + 10}
            y={15}
            textAnchor="start"
            fill={colors.gray}
            angle={rightRotate}
          >
            {config.rightLabel}
          </Text>

          <Line
            x1={x}
            x2={x}
            y1={height}
            y2={0}
            stroke={colors.gray}
            strokeWidth="2"
          />
        </Group>
      );
  }
}
