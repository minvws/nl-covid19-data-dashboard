import {
  ArticleSummary,
  ArticleTeaser,
} from '~/components-styled/article-teaser';
import { Box } from '~/components-styled/base';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { EditorialSummary } from './editorial-teaser';
import { EditorialTeaser } from './editorial-teaser';
import {
  CustomContentTeaser,
  CustomContentProps,
} from '~/components-styled/custom-content-teaser';

type EditorialTileProps = {
  editorial: EditorialSummary;
  highlighted: {
    article?: ArticleSummary;
    customContent?: CustomContentProps;
  };
};

export function EditorialTile(props: EditorialTileProps) {
  const { editorial, highlighted } = props;
  const breakpoints = useBreakpoints();

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
        {highlighted.article && (
          <ArticleTeaser
            cover={highlighted.article.cover}
            slug={highlighted.article.slug.current}
            summary={highlighted.article.summary}
            title={highlighted.article.title}
          />
        )}
        {highlighted.customContent && (
          <CustomContentTeaser
            cover={highlighted.customContent.cover}
            link={highlighted.customContent.link}
            summary={highlighted.customContent.summary}
            title={highlighted.customContent.title}
          />
        )}
      </Box>
    </Box>
  );
}
