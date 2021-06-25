import { ArrowIconLeft } from '~/components/arrow-icon';
import { Box } from '~/components/base';
import { ContentBlock } from '~/components/cms/content-block';
import { Heading, InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { Article } from '~/types/cms';
import { ContentImage } from './cms/content-image';
import { RichContent } from './cms/rich-content';
import { LinkWithIcon } from './link-with-icon';
import { PublicationDate } from './publication-date';

interface ArticleDetailProps {
  article: Article;
}

const imageSizes = [
  // viewport min-width 700px display images at max. 636px wide
  [700, 636],
];

export function ArticleDetail({ article }: ArticleDetailProps) {
  const { siteText } = useIntl();
  return (
    <Box bg="white" py={{ _: 4, md: 5 }}>
      <ContentBlock spacing={3}>
        <LinkWithIcon href="/artikelen" icon={<ArrowIconLeft />}>
          {siteText.article_detail.back_link.text}
        </LinkWithIcon>

        <Box spacing={2}>
          <Heading level={1} mb={0}>
            {article.title}
          </Heading>
          <InlineText color="annotation">
            <PublicationDate date={article.publicationDate} />
          </InlineText>
        </Box>

        <Box fontWeight="bold" fontSize="1.25rem">
          <RichContent blocks={article.intro} contentWrapper={ContentBlock} />
        </Box>

        <ContentImage
          node={article.cover}
          contentWrapper={ContentBlock}
          sizes={imageSizes}
        />
      </ContentBlock>

      {!!article.content?.length && (
        <ContentBlock>
          <Box fontSize="1.125rem">
            <RichContent
              blocks={article.content}
              contentWrapper={ContentBlock}
            />
          </Box>
        </ContentBlock>
      )}
    </Box>
  );
}
