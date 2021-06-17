import css from '@styled-system/css';
import { Box } from '~/components/base';
import { PercentageBar } from '~/components/percentage-bar';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';

export function PercentageBarWithNumber({
  percentage,
  color,
}: {
  percentage: number;
  color: string;
}) {
  const { formatPercentage } = useIntl();
  return (
    <Box
      color={color}
      display="flex"
      alignItems="center"
      pr={{ _: 0, sm: 2, lg: 4, xl: 5 }}
    >
      <InlineText
        fontWeight="bold"
        color="black"
        textAlign="right"
        css={css({ minWidth: 40 })}
        mr={2}
      >
        {`${formatPercentage(percentage, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })}%`}
      </InlineText>
      <PercentageBar percentage={percentage} height="8px" />
    </Box>
  );
}
