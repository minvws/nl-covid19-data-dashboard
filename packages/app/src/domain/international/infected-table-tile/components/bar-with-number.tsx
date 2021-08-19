import { Box } from '~/components/base';
import { PercentageBar } from '~/components/percentage-bar';
import { InlineText } from '~/components/typography';

export function BarWithNumber({
  amount,
  percentage,
  color,
  formatValue,
}: {
  amount: number;
  percentage: number;
  color: string;
  formatValue: (value: number) => string;
}) {
  return (
    <Box
      color={color}
      display="flex"
      pr={3}
      alignItems="center"
      spacingHorizontal={2}
    >
      <Box minWidth="4ch" textAlign="right">
        <InlineText fontWeight="bold" color="black">
          {formatValue(amount)}
        </InlineText>
      </Box>
      <PercentageBar percentage={percentage} height="12px" />
    </Box>
  );
}
