import css from '@styled-system/css';
import styled from 'styled-components';
import { ArrowIconRight } from '~/components-styled/arrow-icon';
import { getImageSrc } from '~/lib/sanity';
import siteText from '~/locale';
import { Article, Block, ImageBlock } from '~/types/cms';
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
      <ArrowIconRight />
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
