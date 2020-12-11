import css from '@styled-system/css';
import { Box } from '../base';

interface BarChartTooltipContentProps {
  value: any;
}

export function BarChartTooltipContent({ value }: BarChartTooltipContentProps) {
  return (
    <Box p={1} css={css({ whiteSpace: 'nowrap' })}>
      {value.label}
    </Box>
  );
}
