import { colors } from '~/style/theme';
import { Group } from '@visx/group';
import { Line } from '@visx/shape';
import { Text } from '@visx/text';

interface BenchmarkProps {
  value: number;
  label: string;
  top: number;
  width: number;
}

const color = colors.data.benchmark;

export function Benchmark({ top, value, label, width }: BenchmarkProps) {
  return (
    <Group top={top}>
      <Text fontSize="14px" dy={-8} fill={color}>
        {`${label}: ${value}`}
      </Text>
      <Line
        stroke={color}
        strokeDasharray="4,3"
        from={{ x: 0, y: 0 }}
        to={{ x: width, y: 0 }}
      />
    </Group>
  );
}
