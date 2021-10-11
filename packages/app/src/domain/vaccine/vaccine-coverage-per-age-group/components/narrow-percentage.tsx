import css from '@styled-system/css';
import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { asResponsiveArray } from '~/style/utils';

interface NarrowPercentageProps {
  value: string;
  color: string;
  textLabel: string;
}

export function NarrowPercentage({
  value,
  color,
  textLabel,
}: NarrowPercentageProps) {
  return (
    <Box
      css={css({
        display: 'flex',
        alignItems: 'center',
        pr: asResponsiveArray({ _: 3, xl: 4 }),
      })}
    >
      <Box pr={3} minWidth="8.5rem" textAlign="left">
        <InlineText>{`${textLabel}:`}</InlineText>
      </Box>
      <Box
        width={10}
        height={10}
        backgroundColor={color}
        borderRadius="50%"
        mr={2}
      />
      {value}
    </Box>
  );
}
