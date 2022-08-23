import css from '@styled-system/css';
import { ArticleSummary } from '~/components/article-teaser';
import { Box } from '~/components/base';
import { ContentTeaser } from '~/components/content-teaser';
import { SiteText } from '~/locale';
import { asResponsiveArray } from '~/style/utils';
interface ArticleListProps {
  articles: ArticleSummary[];
  text: SiteText['pages']['topical_page']['shared'];
}

export function ArticleList({ articles, text }: ArticleListProps) {
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
          key={item.slug.current}
          title={item.title}
          slug={item.slug.current}
          cover={item.cover}
          category={item.category}
          variant="small"
          isArticle
          text={text}
        />
      ))}
    </Box>
  );
}
