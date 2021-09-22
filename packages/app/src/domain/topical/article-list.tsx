import { Box } from '~/components/base';
import { TeaserItem, TeaserItemProps } from '~/components/teaser-item';

interface ArticlesListProps {
  articles: TeaserItemProps[];
}

export function ArticlesList({ articles }: ArticlesListProps) {
  return (
    <article>
      <Box
        display="flex"
        justifyContent="space-between"
        flexDirection={{ _: 'column', md: 'row' }}
        spacing={{ _: 4, md: 0 }}
      >
        {articles.map((item) => (
          <TeaserItem
            key={item.slug}
            title={item.title}
            slug={item.slug}
            cover={item.cover}
            category={item.category}
            variant="small"
          />
        ))}
      </Box>
    </article>
  );
}
