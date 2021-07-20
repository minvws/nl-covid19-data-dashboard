import { Box } from '~/components/base';
import { PercentageBar } from '~/components/percentage-bar';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';

export function BarWithNumber({
  amount,
  percentage,
  color,
}: {
  amount: number;
  percentage: number;
  color: string;
}) {
  const { formatNumber } = useIntl();

  return (
    <Box color={color} display="flex" pr={3} alignItems="center">
      <InlineText
        fontWeight="bold"
        color="black"
        pr={2}
        minWidth="3.2rem"
        textAlign="left"
      >
        {formatNumber(amount)}
      </InlineText>
      <PercentageBar percentage={percentage} height="12px" />
    </Box>
  );
}
