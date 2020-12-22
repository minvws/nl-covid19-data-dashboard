import css from '@styled-system/css';
import styled from 'styled-components';
import ExternalLinkIcon from '~/assets/external-link.svg';
import { Box } from './base';
import { ExternalLink } from './external-link';
import { Tile } from './tile';
import { Heading, Text } from './typography';

type NewsMessageProps = {
  imageSrc: string;
  title: string;
  subtitle: string;
  publishedAt: string;
  href: string;
  anchorText: string;
  message: string;
};

export function NewsMessage(props: NewsMessageProps) {
  const {
    imageSrc,
    title,
    subtitle,
    publishedAt,
    href,
    anchorText,
    message,
  } = props;
  return (
    <Tile
      css={css({
        bg: 'contextualContent',
        flexDirection: [null, 'row'],
      })}
    >
      <Box flex="1 1 25%">
        <img src={imageSrc} />
      </Box>
      <Box flex="1 1 75%" pl={[null, 4]}>
        <Text mt={0} color="gray">
          {subtitle}
          {' • '}
          {publishedAt}
        </Text>
        <Heading level={2}>{title}</Heading>
        <Text>{message}</Text>
        <Box display="flex" flexDirection="row">
          <IconContainer>
            <ExternalLinkIcon />
          </IconContainer>
          <ExternalLink href={href}>{anchorText}</ExternalLink>
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
