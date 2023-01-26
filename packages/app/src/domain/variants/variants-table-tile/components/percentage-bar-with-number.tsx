import { Box } from '~/components/base';
import { PercentageBar } from '~/components/percentage-bar';
import { InlineText } from '~/components/typography';

interface PercentageBarWithNumberProps {
  percentage: number;
  color: string;
  formatValue: (value: number) => string;
}

export const PercentageBarWithNumber = ({ percentage, color, formatValue }: PercentageBarWithNumberProps) => {
  return (
    <Box display="flex" alignItems="center" paddingRight={{ _: 0, sm: 2, lg: 4, xl: 5 }} spacingHorizontal={2}>
      <Box as="span" minWidth="40px" textAlign="right">
        <InlineText>{formatValue(percentage)}%</InlineText>
      </Box>
      <Box color={color} flexGrow={1}>
        <PercentageBar percentage={percentage} height="8px" />
      </Box>
    </Box>
  );
};
