import { ArticleSummary } from '~/components/article-teaser';
import { Box } from '~/components/base';
import { SiteText } from '~/locale';
import { TopicalArticleTeaser } from './topical-article-teaser';

interface TopicalArticlesListProps {
  articles: ArticleSummary[];
  text: SiteText['pages']['topical_page']['shared'];
}

export const TopicalArticlesList = ({ articles }: TopicalArticlesListProps) => {
  return (
    <Box display="grid" gridColumnGap={{ md: '48px' }} gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }} spacing={{ _: 3, md: 0 }}>
      {articles.map((item) => (
        <TopicalArticleTeaser key={item.slug.current} title={item.title} slug={item.slug.current} cover={item.cover} category={item.category} />
      ))}
    </Box>
  );
};
