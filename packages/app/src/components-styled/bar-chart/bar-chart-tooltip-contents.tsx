import css from '@styled-system/css';
import { Box } from '../base';
import { BarChartValue } from './bar-chart-coordinates';

interface BarChartTooltipContentProps {
  value: BarChartValue;
}

export function BarChartTooltipContent({ value }: BarChartTooltipContentProps) {
  return (
    <Box p={1} css={css({ whiteSpace: 'nowrap' })}>
      {value.tooltip}
    </Box>
  );
}
