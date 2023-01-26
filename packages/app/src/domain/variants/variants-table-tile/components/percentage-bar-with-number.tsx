import { Box } from '~/components/base';
import { PercentageBar } from '~/components/percentage-bar';
import { InlineText } from '~/components/typography';
import { space } from '~/style/theme';

interface PercentageBarWithNumberProps {
  percentage: number;
  color: string;
  formatValue: (value: number) => string;
}

export const PercentageBarWithNumber = ({ percentage, color, formatValue }: PercentageBarWithNumberProps) => {
  return (
    <Box display="flex" alignItems="center" paddingRight={{ _: space[0], sm: space[2], lg: space[4], xl: space[5] }} spacingHorizontal={2}>
      <Box as="span" minWidth="40px" textAlign="right">
        <InlineText>{formatValue(percentage)}%</InlineText>
      </Box>
      <Box color={color} flexGrow={1}>
        <PercentageBar percentage={percentage} height="8px" />
      </Box>
    </Box>
  );
};
