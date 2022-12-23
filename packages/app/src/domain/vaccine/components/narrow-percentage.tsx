import css from '@styled-system/css';
import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { space } from '~/style/theme';
import { asResponsiveArray } from '~/style/utils';

interface NarrowPercentageProps {
  value: string;
  color: string;
  textLabel: string;
}

export function NarrowPercentage({ value, color, textLabel }: NarrowPercentageProps) {
  return (
    <Box
      css={css({
        display: 'flex',
        alignItems: 'center',
        paddingRight: asResponsiveArray({ _: space[3], xl: space[4] }),
      })}
    >
      <Box paddingRight={space[3]} minWidth="8.5rem" textAlign="left">
        <InlineText>{`${textLabel}:`}</InlineText>
      </Box>
      <Box width={'10px'} height={'10px'} backgroundColor={color} borderRadius="50%" marginRight={space[2]} />
      {value}
    </Box>
  );
}
