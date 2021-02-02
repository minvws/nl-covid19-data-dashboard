import css from '@styled-system/css';
import ArrowIcon from '~/assets/arrow.svg';
import { Box } from '~/components-styled/base';
import { ContentBlock } from '~/components-styled/cms/content-block';
import { Heading } from '~/components-styled/typography';
import siteText from '~/locale';
import { Article } from '~/types/cms';
import { ContentImage } from './cms/content-image';
import { RichContent } from './cms/rich-content';
import { LinkWithIcon } from './link-with-icon';
import { PublicationDate } from './publication-date';

interface ArticleDetailProps {
  article: Article;
}

export function ArticleDetail({ article }: ArticleDetailProps) {
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

        <Box fontWeight="bold" fontSize="1.25rem">
          <RichContent blocks={article.intro} contentWrapper={ContentBlock} />
        </Box>

        <ContentImage node={article.cover} contentWrapper={ContentBlock} />
      </ContentBlock>

      {!!article.content?.length && (
        <Box fontSize="1.125rem">
          <RichContent blocks={article.content} contentWrapper={ContentBlock} />
        </Box>
      )}
    </Box>
  );
}
