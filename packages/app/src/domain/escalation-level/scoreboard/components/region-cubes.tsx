import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { EscalationLevel } from '~/domain/restrictions/types';
import { useIntl } from '~/intl';
import { asResponsiveArray } from '~/style/utils';
import { useEscalationColor } from '~/utils/use-escalation-color';

export function RegionCubes({
  count,
  level,
}: {
  count: number;
  level: EscalationLevel;
}) {
  const items = new Array(count).fill(0);

  const escalationColor = useEscalationColor(level);

  const { siteText } = useIntl();

  const regionLabels =
    siteText.over_risiconiveaus.scoreboard.current_level.regions;

  const regionLabel =
    count > 1
      ? regionLabels.plural
      : count === 1
      ? regionLabels.single
      : regionLabels.none;

  return (
    <Box display={{ sm: 'flex' }} flexWrap="wrap" alignItems="center">
      {count > 0 && (
        <Container>
          {items.map((_, index) => (
            <Cube color={escalationColor} key={index} />
          ))}
        </Container>
      )}
      <InlineText variant="body2">
        {count > 0 ? count : undefined} {regionLabel}
      </InlineText>
    </Box>
  );
}

const Container = styled.div(
  css({
    mr: 2,
    my: asResponsiveArray({ _: 1, sm: 0 }),
  })
);

const Cube = styled.div<{ color: string }>((x) =>
  css({
    display: 'inline-block',
    mr: '1px',
    minWidth: asResponsiveArray({ _: '0.75rem', md: '1.25rem' }),
    width: asResponsiveArray({ _: '0.75rem', md: '1.25rem' }),
    height: '1.25rem',
    bg: x.color,
    '&:first-child': {
      borderTopLeftRadius: '3px',
      borderBottomLeftRadius: '3px',
    },
    '&:last-child': {
      borderTopRightRadius: '3px',
      borderBottomRightRadius: '3px',
    },
  })
);
