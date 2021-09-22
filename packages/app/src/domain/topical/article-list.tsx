import css from '@styled-system/css';
import { Box } from '~/components/base';
import { ContentTeaser, ContentTeaserProps } from '~/components/content-teaser';
import { asResponsiveArray } from '~/style/utils';
interface ArticleListProps {
  articles: ContentTeaserProps[];
}

export function ArticleList({ articles }: ArticleListProps) {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
      css={css({
        // Same value to be aligned with the footer grid
        columnGap: asResponsiveArray({ md: '48px' }),
      })}
      spacing={{ _: 3, md: 0 }}
    >
      {articles.map((item) => (
        <ContentTeaser
          key={item.slug}
          title={item.title}
          slug={item.slug}
          cover={item.cover}
          category={item.category}
          variant="small"
        />
      ))}
    </Box>
  );
}
