import css from '@styled-system/css';
import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { space } from '~/style/theme';
import { asResponsiveArray } from '~/style/utils';

interface PercentageWideNumberProps {
  value: string;
  color: string;
  justifyContent: string;
}

export function WidePercentage({ value, color, justifyContent }: PercentageWideNumberProps) {
  return (
    <InlineText
      variant="body2"
      textAlign="right"
      css={css({
        display: 'flex',
        alignItems: 'center',
        justifyContent,
        paddingRight: asResponsiveArray({ _: space[3], xl: space[4] }),
      })}
    >
      <Box width={10} height={10} backgroundColor={color} borderRadius="50%" marginRight={space[2]} />
      {value}
    </InlineText>
  );
}
