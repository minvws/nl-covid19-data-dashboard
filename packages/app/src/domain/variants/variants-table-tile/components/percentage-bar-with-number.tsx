import { Box } from '~/components/base';
import { PercentageBar } from '~/components/percentage-bar';
import { BoldText } from '~/components/typography';
import { space } from '~/style/theme';

export function PercentageBarWithNumber({ percentage, color, formatValue }: { percentage: number; color: string; formatValue: (value: number) => string }) {
  return (
    <Box display="flex" alignItems="center" paddingRight={{ _: space[0], sm: space[2], lg: space[4], xl: space[5] }} spacingHorizontal={2}>
      <Box as="span" minWidth={40} textAlign="right">
        <BoldText>{formatValue(percentage)}%</BoldText>
      </Box>
      <Box color={color} flexGrow={1}>
        <PercentageBar percentage={percentage} height="8px" />
      </Box>
    </Box>
  );
}
