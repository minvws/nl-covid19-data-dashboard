import css from '@styled-system/css';
import styled from 'styled-components';
import ArrowIcon from '~/assets/arrow.svg';
import { urlFor } from '~/lib/sanity';
import siteText from '~/locale';
import { Article, Block, ImageBlock } from '~/types/cms';
import { assert } from '~/utils/assert';
import { Link } from '~/utils/link';
import { BackgroundImage } from './background-image';
import { Box } from './base';
import { Heading, InlineText, Text } from './typography';

export type ArticleSummary = Pick<
  Article,
  'title' | 'slug' | 'summary' | 'cover'
>;

type ArticleTeaserProps = {
  title: string;
  slug: string;
  summary: Block;
  cover: ImageBlock;
};

export function ArticleTeaser(props: ArticleTeaserProps) {
  const { title, slug, summary, cover } = props;

  return (
    <Link passHref href={`/artikelen/${slug}`}>
      <StyledArticleTeaser>
        <CoverImage height={200} image={cover} />
        <Box padding={3}>
          <Heading level={3} mb={{ _: 1, sm: 3 }} lineHeight={{ _: 0, sm: 2 }}>
            {title}
          </Heading>
          <Text>{summary}</Text>

          <InlineText aria-hidden="true" fontWeight="bold" color="link">
            {siteText.common.read_more}
            <Arrow />
          </InlineText>
        </Box>
      </StyledArticleTeaser>
    </Link>
  );
}

const StyledArticleTeaser = styled.a(
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
  const url = urlFor(image).url();
  assert(
    url !== null,
    `Could not get url for node: ${JSON.stringify(image, null, 2)}`
  );

  const { hotspot } = image;

  const bgPosition = hotspot
    ? `${hotspot.x * 100}% ${hotspot.y * 100}%`
    : undefined;

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
