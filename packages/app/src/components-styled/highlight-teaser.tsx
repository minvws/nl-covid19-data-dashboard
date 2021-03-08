import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { ArrowIconRight } from '~/components-styled/arrow-icon';
import { Block, ImageBlock } from '~/types/cms';
import { Link } from '~/utils/link';
import { BackgroundImage } from './background-image';
import { Box } from './base';
import { Heading, InlineText, Text } from './typography';

export type HighlightTeaserProps = {
  title: string;
  summary: Block;
  cover: ImageBlock;
  link: {
    href: string;
    label: string;
  };
};

export function HighlightTeaser(props: HighlightTeaserProps) {
  const { title, link, summary, cover } = props;

  return (
    <Link passHref href={link.href}>
      <StyledHightlightTeaser>
        <ZoomContainer height={200}>
          <BackgroundImage
            image={cover}
            height={200}
            sizes={[
              // viewport min-width 1200px display images at max. 438px wide
              [1200, 438],
            ]}
          />
        </ZoomContainer>
        <Box padding={3}>
          <Heading
            level={3}
            mb={{ _: 1, sm: 3 }}
            lineHeight={{ _: 0, sm: 1 }}
            fontSize="1.25rem"
          >
            {title}
          </Heading>
          <Text>{summary}</Text>

          <InlineText aria-hidden="true" fontWeight="bold" color="link">
            {link.label}
            <Arrow />
          </InlineText>
        </Box>
      </StyledHightlightTeaser>
    </Link>
  );
}

const ZoomContainer = styled(ZoomContainerUnstyled)``;

function ZoomContainerUnstyled({
  children,
  height,
  className,
}: {
  height: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Box overflow="hidden" height={height} position="relative">
      <Box className={className}>{children}</Box>
    </Box>
  );
}

const StyledHightlightTeaser = styled.a(
  css({
    display: 'block',
    border: 'solid',
    borderWidth: 1,
    borderColor: 'lightGray',
    borderRadius: 4,
    minHeight: '26rem',
    overflow: 'hidden',
    textDecoration: 'none',
    color: 'body',

    [`${ZoomContainer}, ${Heading}`]: {
      transitionProperty: 'transform, color',
      transitionDuration: '500ms, 250ms',
      transitionTimingFunction: 'ease-out',
      willChange: 'transform',
    },

    '&:hover, &:focus': {
      [ZoomContainer]: {
        transitionTimingFunction: 'ease-in-out',
        transform: 'scale(1.04)',
      },
      [Heading]: { color: 'link' },
    },
  })
);

function Arrow() {
  return (
    <span css={css({ svg: { height: '11px', width: '13px', mx: '3px' } })}>
      <ArrowIconRight />
    </span>
  );
}
