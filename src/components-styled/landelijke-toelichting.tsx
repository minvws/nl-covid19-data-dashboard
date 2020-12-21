import css from '@styled-system/css';
import styled from 'styled-components';
import ExternalLinkIcon from '~/assets/external-link.svg';
import siteText from '~/locale';
import theme from '~/style/theme';
import { Box } from './base';
import { ExternalLink } from './external-link';
import { Tile } from './tile';
import { Heading, Text } from './typography';

export function LandelijkeToelichting() {
  return (
    <Tile
      css={css({
        bg: theme.colors.contextualContent,
        flexDirection: [null, 'row'],
      })}
    >
      <Box flex="1 1 25%">
        <img src="images/toelichting-afbeelding.png" />
      </Box>
      <Box flex="1 1 75%" pl={[null, 4]}>
        <Box display="flex">
          <Text mt={0}>{siteText.notificatie.subtitel}</Text>
          <Text mt={0} mx={2}>
            {'\u2022'}
          </Text>
          <Text mt={0}> {siteText.notificatie.datum}</Text>
        </Box>
        <Heading level={2}>{siteText.notificatie.titel}</Heading>
        <Text>{siteText.notificatie.bericht}</Text>
        <Box display="flex" flexDirection="row">
          <IconContainer>
            <ExternalLinkIcon />
          </IconContainer>
          <ExternalLink href={siteText.notificatie.link.href}>
            {siteText.notificatie.link.text}
          </ExternalLink>
        </Box>
      </Box>
    </Tile>
  );
}

const IconContainer = styled.span(
  css({
    mr: 2,
    svg: {
      width: 18,
      height: 18,
      display: 'block',
      maxWidth: 'initial',
      color: 'blue',
    },
  })
);
