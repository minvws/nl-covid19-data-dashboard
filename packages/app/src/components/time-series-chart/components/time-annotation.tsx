import { colors } from '@corona-dashboard/common';
import { Group } from '@visx/group';
import { Line } from '@visx/shape';
import { Text } from '@visx/text';
import theme from '~/style/theme';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { GetX, TimeAnnotationConfig } from '../logic';

export function TimeAnnotation({
  domain,
  getX,
  height,
  config,
}: {
  domain: [number, number];
  height: number;
  getX: GetX;
  config: TimeAnnotationConfig;
}) {
  const [min, max] = domain;
  const { position } = config;

  const breakpoints = useBreakpoints(true);

  if (position < min || position > max) {
    return null;
  }

  const x = getX({ __date_unix: position });

  const fontSize = !breakpoints.lg ? theme.fontSizes[0] : theme.fontSizes[1];

  switch (config.type) {
    case 'divider':
      return (
        <Group>
          <Text
            fontSize={fontSize}
            x={x - 15}
            y={15}
            textAnchor="end"
            fill={colors.gray}
          >
            {config.leftLabel}
          </Text>
          <Text
            fontSize={fontSize}
            x={x + 15}
            y={15}
            textAnchor="start"
            fill={colors.gray}
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
