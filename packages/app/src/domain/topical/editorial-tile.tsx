import {
  ArticleSummary,
  ArticleTeaser,
} from '~/components-styled/article-teaser';
import { Box } from '~/components-styled/base';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { EditorialSummary, EditorialTeaser } from './editorial-teaser';

type EditorialTileProps = {
  editorial: EditorialSummary;
  highlightedArticle: ArticleSummary;
};

export function EditorialTile(props: EditorialTileProps) {
  const { editorial, highlightedContent } = props;
  const breakpoints = useBreakpoints();

  const content = highlightedContent.isArticle ? 
    highlightedContent.article : 
    highlightedContent.custom
  
  return (
    <Box
      display="flex"
      spacingHorizontal={breakpoints.lg}
      spacing={3}
      flexDirection={{ _: 'column', lg: 'row' }}
    >
      <Box flex={{ lg: '1 1 66%' }}>
        <EditorialTeaser
          cover={editorial.cover}
          slug={editorial.slug.current}
          summary={editorial.summary}
          title={editorial.title}
        />
      </Box>
      <Box flex={{ lg: '1 1 33%' }}>
        <ArticleTeaser
          cover={content.cover}
          slug={highlightedContent.isArticle ? content.slug.current : content.href}
          summary={content.summary}
          title={content.title}
        />
      </Box>
    </Box>
  );
}
