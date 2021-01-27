import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import ArrowIcon from '~/assets/arrow.svg';
import { BackgroundImage } from '~/components-styled/background-image';
import { Box } from '~/components-styled/base';
import { Heading, InlineText, Text } from '~/components-styled/typography';
import siteText from '~/locale';
import { Block, Editorial, ImageBlock } from '~/types/cms';
import { Link } from '~/utils/link';
import { imageResizeTargets } from '@corona-dashboard/common';
import { findClosestSize } from '~/utils/findClosestSize';

export type EditorialSummary = Pick<
  Editorial,
  'title' | 'slug' | 'summary' | 'cover'
>;

type EditorialTeaserProps = {
  title: string;
  slug: string;
  summary: Block;
  cover: ImageBlock;
};

export function EditorialTeaser(props: EditorialTeaserProps) {
  const { title, slug, summary, cover } = props;

  return (
    <Link passHref href={`/weekberichten/${slug}`}>
      <StyledEditorialTeaser>
        <CoverImage image={cover}>
          <StyledTextOverlay>
            <Box width={{ lg: '60%' }}>
              <Heading level={3} fontSize={5} lineHeight="1em">
                {title}
              </Heading>
              <Text>{summary}</Text>
              <InlineText aria-hidden="true" fontWeight="bold" color="white">
                {siteText.common.read_more}
                <Arrow />
              </InlineText>
            </Box>
          </StyledTextOverlay>
        </CoverImage>
      </StyledEditorialTeaser>
    </Link>
  );
}

const StyledTextOverlay = styled.div(
  css({
    padding: 3,
    display: 'flex',
    flexDirection: 'column',
    justifyItems: 'flex-end',
    minHeight: '26rem',
    height: '100%',
    justifyContent: 'flex-end',
    transitionProperty: 'transform, color',
    transitionDuration: '500ms, 250ms',
    transitionTimingFunction: 'ease-out',
    willChange: 'transform',

    '&:hover, &:focus': {
      transitionTimingFunction: 'ease-in-out',
      transform: 'scale(0.96)',
    },
  })
);

const StyledEditorialTeaser = styled.a(
  css({
    display: 'block',
    border: 'solid',
    borderWidth: 1,
    borderColor: 'lightGray',
    borderRadius: 4,
    minHeight: '26rem',
    overflow: 'hidden',
    textDecoration: 'none',
    color: 'white',
    height: '100%',

    [`${BackgroundImage}, ${Heading}`]: {
      transitionProperty: 'transform, color',
      transitionDuration: '500ms, 250ms',
      transitionTimingFunction: 'ease-out',
      willChange: 'transform',
    },

    '&:hover, &:focus': {
      [BackgroundImage]: {
        transitionTimingFunction: 'ease-in-out',
        transform: 'scale(1.04)',
      },
    },
  })
);

function Arrow() {
  return (
    <span css={css({ svg: { height: '11px', width: '13px', mx: '3px' } })}>
      <ArrowIcon css={css({ transform: 'rotate(-90deg)' })} />
    </span>
  );
}

type CoverImageProps = {
  image: ImageBlock;
  children: ReactNode;
};

function CoverImage({ image, children }: CoverImageProps) {
  const { hotspot, asset } = image;

  const bgPosition = hotspot
    ? `${hotspot.x * 100}% ${hotspot.y * 100}%`
    : undefined;

  const url = `/cms/${asset.assetId}-${findClosestSize(
    700,
    imageResizeTargets
  )}.${asset.extension}`;

  return (
    <BackgroundImage
      height="100%"
      backgroundImage={`linear-gradient(to left, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.75)), url(${url})`}
      backgroundPosition={bgPosition}
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      aria-label={image.alt}
    >
      {children}
    </BackgroundImage>
  );
}
