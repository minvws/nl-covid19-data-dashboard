import css from '@styled-system/css';
import { Box } from '~/components/base';
import { TeaserItem, TeaserItemProps } from '~/components/teaser-item';
import { asResponsiveArray } from '~/style/utils';
interface ArticlesListProps {
  articles: TeaserItemProps[];
}

export function ArticlesList({ articles }: ArticlesListProps) {
  return (
    <article>
      <Box
        display="grid"
        gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        css={css({
          columnGap: asResponsiveArray({ md: '48px' }), // Same numbers to be aligned with the footer grid
        })}
        spacing={{ _: 3, md: 0 }}
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
