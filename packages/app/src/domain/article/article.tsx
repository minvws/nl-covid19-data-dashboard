import { Box } from '~/components-styled/base';
import { Heading } from '~/components-styled/typography';
import { Article } from '~/types/cms';
import { RichContent } from '../cms/rich-content';

interface ArticleDetailProps {
  article: Article;
}

export function ArticleDetail({ article }: ArticleDetailProps) {
  return (
    <Box bg="white">
      <Box mx="auto" maxWidth={{ md: 'contentWidth' }}>
        <Heading level={1} mb={0}>
          {article.title}
        </Heading>
      </Box>

      {!!article.content?.length && <RichContent blocks={article.content} />}
    </Box>
  );
}
