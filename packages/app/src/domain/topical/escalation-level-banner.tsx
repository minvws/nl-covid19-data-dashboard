import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { Heading, InlineText } from '~/components/typography';
import { asResponsiveArray } from '~/style/utils';

interface EscalationLevelBannerProps {
  level: 1 | 2 | 3 | 4;
}

export function EscalationLevelBanner({
  level = '1',
}: EscalationLevelBannerProps) {
  return (
    <Tile>
      <Box>Kaart van nederland</Box>
      <Box display="flex" flexDirection="column">
        <Heading level={3}>het risiconiveau van Nederland</Heading>
        <Box display="flex">
          <InlineText>
            <Indicator>{level}</Indicator>Zorgelijk
          </InlineText>
          geldig sinds 16 september
        </Box>
        <a> Linkje</a>
      </Box>
    </Tile>
  );
}

const Tile = styled.article(
  css({
    position: 'relative',
    display: 'flex',
    backgroundColor: 'grey',
    p: asResponsiveArray({ _: 3, sm: 4 }),
    borderRadius: 1,
    boxShadow: 'tile',

    '&:before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      height: ' 100%',
      width: '1rem',
      backgroundColor: 'blue',
      borderTopLeftRadius: 1,
      borderBottomLeftRadius: 1,
    },
  })
);

const Indicator = styled.div(
  css({
    height: '2.5rem',
    width: '2.5rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    color: 'white',
  })
);
