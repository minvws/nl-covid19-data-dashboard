import css from '@styled-system/css';
import styled from 'styled-components';
import ArrowIcon from '~/assets/arrow.svg';
import { getImageSrc } from '~/lib/sanity';
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
        <CoverImage height={200} image={cover} />
        <Box padding={3}>
          <Heading level={3} mb={{ _: 1, sm: 3 }} lineHeight={{ _: 0, sm: 2 }}>
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
      [Heading]: { color: 'link' },
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
  height: number;
};

function CoverImage({ height, image }: CoverImageProps) {
  const bgPosition = image.hotspot
    ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`
    : undefined;

  const url = getImageSrc(image.asset, 700);

  return (
    <Box height={height} overflow="hidden">
      <BackgroundImage
        height={height}
        backgroundImage={`url(${url})`}
        backgroundPosition={bgPosition}
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        aria-label={image.alt}
      />
    </Box>
  );
}
