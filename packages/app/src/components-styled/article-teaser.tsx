import css from '@styled-system/css';
import ArrowIcon from '~/assets/arrow.svg';
import { LinkWithIcon } from '~/components-styled/link-with-icon';
import { urlFor } from '~/lib/sanity';
import siteText from '~/locale';
import { Article, Block, ImageBlock } from '~/types/cms';
import { assert } from '~/utils/assert';
import { BackgroundImage } from './background-image';
import { Box } from './base';
import { Heading, Text } from './typography';

export type ArticleSummary = Pick<
  Article,
  'title' | 'slug' | 'summary' | 'cover'
>;

type ArticleLinkProps = {
  title: string;
  slug: string;
  summary: Block;
  cover: ImageBlock;
};

export function ArticleTeaser(props: ArticleLinkProps) {
  const { title, slug, summary, cover } = props;

  return (
    <Box
      border="solid"
      borderWidth={1}
      borderColor="border"
      borderRadius={4}
      minHeight={'26rem'}
      maxHeight={'26rem'}
      minWidth={{ _: '20rem', lg: '24rem' }}
      maxWidth={{ _: '20rem', lg: '24rem' }}
      overflow="hidden"
    >
      {<CoverImage image={cover} />}
      <Box padding={3}>
        <Heading level={3}>{title}</Heading>
        <Text>{summary}</Text>
        <LinkWithIcon
          href={`/artikelen/${slug}`}
          icon={<ArrowIcon css={css({ transform: 'rotate(-90deg)' })} />}
          iconPlacement="right"
        >
          {siteText.common.read_more}
        </LinkWithIcon>
      </Box>
    </Box>
  );
}

type CoverImageProps = {
  image: ImageBlock;
};

function CoverImage({ image }: CoverImageProps) {
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
    <BackgroundImage
      style={{ height: '200px', width: '100%' }}
      backgroundImage={`url(${url})`}
      backgroundPosition={bgPosition}
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      aria-label={image.alt}
      role="img"
    />
  );
}
