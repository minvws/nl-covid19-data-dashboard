import ArrowIcon from '~/assets/arrow.svg';
import { LinkWithIcon } from '~/components-styled/link-with-icon';
import { urlFor } from '~/lib/sanity';
import siteText from '~/locale';
import { Article, ImageBlock, RichContentImageBlock } from '~/types/cms';
import { assert } from '~/utils/assert';
import { Box } from './base';
import { BackgroundImageBox } from './base/background-image-box';
import { Heading, Text } from './typography';

export type ArticleSummary = Pick<
  Article,
  'title' | 'slug' | 'summary' | 'cover'
>;

type ArticleLinkProps = {
  articleSummary: ArticleSummary;
};

export function ArticleLink(props: ArticleLinkProps) {
  const { articleSummary } = props;

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
      {articleSummary.cover && <CoverImage image={articleSummary.cover} />}
      <Box padding={3}>
        <Heading level={3}>{articleSummary.title}</Heading>
        {articleSummary.summary && (
          <Box>
            <Text>{articleSummary.summary}</Text>
          </Box>
        )}
        <LinkWithIcon
          href={`/artikelen/${articleSummary.slug.current}`}
          icon={<ArrowIcon />}
          iconPlacement="right"
        >
          {siteText.common.read_more}
        </LinkWithIcon>
      </Box>
    </Box>
  );
}

type CoverImageProps = {
  image: ImageBlock | RichContentImageBlock;
};

function CoverImage({ image }: CoverImageProps) {
  const url = urlFor(image).url();
  assert(
    url !== null,
    `could not get url for node: ${JSON.stringify(image, null, 2)}`
  );

  const { hotspot } = image;

  console.dir(hotspot);

  const bgPosition = hotspot
    ? `${hotspot.x * 100}% ${hotspot.y * 100}%`
    : undefined;

  return (
    <BackgroundImageBox
      style={{ height: '200px', width: '100%' }}
      backgroundImage={`url(${url})`}
      backgroundPosition={bgPosition}
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      title={image.alt}
      role="img"
    ></BackgroundImageBox>
  );
}
