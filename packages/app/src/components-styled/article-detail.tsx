import css from '@styled-system/css';
import ArrowIcon from '~/assets/arrow.svg';
import { Box } from '~/components-styled/base';
import { ContentBlock } from '~/components-styled/cms/content-block';
import { Image } from '~/components-styled/cms/image';
import { Heading } from '~/components-styled/typography';
import siteText from '~/locale';
import { Article } from '~/types/cms';
import { formatDateFromMilliseconds } from '~/utils/formatDate';
import { RichContent } from './cms/rich-content';
import { LinkWithIcon } from './link-with-icon';

interface ArticleDetailProps {
  article: Article;
}

export function ArticleDetail({ article }: ArticleDetailProps) {
  return (
    <Box bg="white" py={{ _: 4, md: 5 }}>
      <ContentBlock spacing={3}>
        <LinkWithIcon href="/artikelen" icon={<ArrowIcon />}>
          {siteText.article_detail.back_link.text}
        </LinkWithIcon>

        <Box spacing={2}>
          <Heading level={1} mb={0}>
            {article.title}
          </Heading>
          {article.publicationDate && (
            <time
              css={css({ color: 'gray' })}
              dateTime={article.publicationDate}
            >
              {formatDateFromMilliseconds(
                new Date(article.publicationDate).getTime(),
                'medium'
              )}
            </time>
          )}
        </Box>

        {article.intro && (
          <Box fontWeight="bold">
            <RichContent blocks={article.intro} />
          </Box>
        )}

        {article.cover && <Image node={article.cover} />}
      </ContentBlock>

      {!!article.content?.length && <RichContent blocks={article.content} />}
    </Box>
  );
}
