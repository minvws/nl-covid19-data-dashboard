import css from '@styled-system/css';
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
        {formatValue(percentage)}%
      </InlineText>
      <PercentageBar percentage={percentage} height="8px" />
    </Box>
  );
}
