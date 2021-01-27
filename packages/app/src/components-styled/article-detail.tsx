import css from '@styled-system/css';
import ArrowIcon from '~/assets/arrow.svg';
import { Box } from '~/components-styled/base';
import { ContentBlock } from '~/components-styled/cms/content-block';
import { Image } from '~/components-styled/image';

import { Heading } from '~/components-styled/typography';
import { PortableText } from '~/lib/sanity';
import siteText from '~/locale';
import { Article } from '~/types/cms';
import { RichContent } from './cms/rich-content';
import { LinkWithIcon } from './link-with-icon';
import { PublicationDate } from './publication-date';

interface ArticleDetailProps {
  article: Article;
}

export function ArticleDetail({ article }: ArticleDetailProps) {
  const { coverAsset } = article;

  return (
    <Box bg="white" py={{ _: 4, md: 5 }}>
      <ContentBlock spacing={3}>
        <LinkWithIcon
          href="/artikelen"
          icon={<ArrowIcon css={css({ transform: 'rotate(90deg)' })} />}
        >
          {siteText.article_detail.back_link.text}
        </LinkWithIcon>

        <Box spacing={2}>
          <Heading level={1} mb={0}>
            {article.title}
          </Heading>
          <PublicationDate date={article.publicationDate} />
        </Box>

        <Box fontWeight="bold">
          <PortableText blocks={article.intro} />
        </Box>

        {/* <Image node={article.cover} /> */}

        <Image
          src={`/${coverAsset.assetId}.${coverAsset.extension}`}
          width={630}
          height={630 / coverAsset.metadata.dimensions.aspectRatio}
        />
      </ContentBlock>

      {!!article.content?.length && <RichContent blocks={article.content} />}
    </Box>
  );
}
