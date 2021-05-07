import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { asResponsiveArray } from '~/style/utils';
import { useEscalationColor } from '~/utils/use-escalation-color';

export function RegionCubes({
  count,
  level,
}: {
  count: number;
  level: 1 | 2 | 3 | 4;
}) {
  const items = new Array(count).fill(0);

  const escalationColor = useEscalationColor(level);

  return (
    <Box display="flex">
      {count > 0 && (
        <Container>
          {items.map((_, index) => (
            <Cube color={escalationColor} key={index} />
          ))}
        </Container>
      )}
      <InlineText color="black" fontSize={2}>
        {count} regio's
      </InlineText>
    </Box>
  );
}

const Container = styled.div(
  css({
    display: 'flex',
    mr: 2,
    maxWidth: '90%',
  })
);

const Cube = styled.div<{ color: string }>((x) =>
  css({
    minWidth: asResponsiveArray({ _: '0.5em', lg: '1em' }),
    width: asResponsiveArray({ _: '0.5em', lg: '1.5em' }),
    height: asResponsiveArray({ _: '0.5em', lg: '1em' }),
    bg: x.color,
    ml: '1px',
    '&:first-child': {
      borderTopLeftRadius: '4px',
      borderBottomLeftRadius: '4px',
      ml: 0,
    },
    '&:last-child': {
      borderTopRightRadius: '4px',
      borderBottomRightRadius: '4px',
    },
  })
);
