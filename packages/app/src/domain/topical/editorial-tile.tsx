import {
  ArticleSummary,
  ArticleTeaser,
} from '~/components-styled/article-teaser';
import { Box } from '~/components-styled/base';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { EditorialSummary } from './editorial-teaser';
import { Block, ImageBlock } from '~/types/cms';
import { EditorialTeaser } from './editorial-teaser';

type EditorialTileProps = {
  editorial: EditorialSummary;
  highlightedContent: {
    isArticle: boolean;
    item: ArticleSummary | CustomContentProps;
  };
};

export type CustomContentProps = {
  title: string;
  summary: Block;
  cover: ImageBlock;
  link: {
    href: string;
    label: string;
  };
};

export function EditorialTile(props: EditorialTileProps) {
  const { editorial, highlightedContent } = props;
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
        <ArticleTeaser
          cover={highlightedContent.item.cover}
          slug={
            highlightedContent.isArticle
              ? highlightedContent.item.slug.current
              : highlightedContent.item.link.href
          }
          summary={highlightedContent.item.summary}
          title={highlightedContent.item.title}
          label={
            highlightedContent.isArticle
              ? null
              : highlightedContent.item.link.label
          }
        />
      </Box>
    </Box>
  );
}
