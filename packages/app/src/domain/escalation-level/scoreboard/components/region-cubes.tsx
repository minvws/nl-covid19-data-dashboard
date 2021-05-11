import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
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

  const { siteText } = useIntl();

  const regionLabels = siteText.over_risiconiveaus.scoreboard.regions;

  const regionLabel =
    count > 1
      ? regionLabels.plural
      : count === 1
      ? regionLabels.single
      : regionLabels.none;

  return (
    <Box display="flex" flexWrap="wrap">
      {count > 0 && (
        <Container>
          {items.map((_, index) => (
            <Cube color={escalationColor} key={index} />
          ))}
        </Container>
      )}
      <InlineText color="black" fontSize={2}>
        {count > 0 ? count : undefined} {regionLabel}
      </InlineText>
    </Box>
  );
}

const Container = styled.div(
  css({
    display: 'flex',
    gap: '1px',
    alignItems: 'center',
    mr: 2,
    flexWrap: 'wrap',
  })
);

const Cube = styled.div<{ color: string }>((x) =>
  css({
    minWidth: asResponsiveArray({ _: '0.5em', sm: '1em' }),
    width: asResponsiveArray({ _: '0.5em', sm: '1em' }),
    height: '1em',
    bg: x.color,
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
