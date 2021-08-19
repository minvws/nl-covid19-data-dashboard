import { Box } from '~/components/base';
import { PercentageBar } from '~/components/percentage-bar';
import { InlineText } from '~/components/typography';

export function PercentageBarWithNumber({
  percentage,
  color,
  formatValue,
}: {
  percentage: number;
  color: string;
  formatValue: (value: number) => string;
}) {
  return (
    <Box
      display="flex"
      alignItems="center"
      pr={{ _: 0, sm: 2, lg: 4, xl: 5 }}
      spacingHorizontal={2}
    >
      <Box as="span" minWidth={40} textAlign="right">
        <InlineText fontWeight="bold">{formatValue(percentage)}%</InlineText>
      </Box>
      <Box color={color} flexGrow={1}>
        <PercentageBar percentage={percentage} height="8px" />
      </Box>
    </Box>
  );
}
