import css from '@styled-system/css';
import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { asResponsiveArray } from '~/style/utils';

interface PercentageWideNumberProps {
  value: string;
  color: string;
  justifyContent: string;
}

export function WidePercentage({
  value,
  color,
  justifyContent,
}: PercentageWideNumberProps) {
  return (
    <InlineText
      variant="body2"
      textAlign="right"
      css={css({
        display: 'flex',
        alignItems: 'center',
        justifyContent,
        pr: asResponsiveArray({ _: 3, xl: 4 }),
      })}
    >
      <Box
        width={10}
        height={10}
        backgroundColor={color}
        borderRadius="50%"
        mr={2}
      />
      {value}
    </InlineText>
  );
}
