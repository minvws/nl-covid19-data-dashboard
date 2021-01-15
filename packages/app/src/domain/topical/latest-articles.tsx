import { ArticleSummary } from '~/components-styled/article-summary';
import { Box } from '~/components-styled/base';
import { Tile } from '~/components-styled/tile';
import { Heading } from '~/components-styled/typography';
import siteText from '~/locale';
import { LatestArticle } from '~/pages';

type LatestArticlesProps = {
  articles: LatestArticle[];
};

export function LatestArticles({ articles }: LatestArticlesProps) {
  return (
    <Tile>
      <Heading level={2}>
        {siteText.nationaal_actueel.latest_articles.title}
      </Heading>
      <Box display="flex" spacing={4} spacingHorizontal={true}>
        {articles.map((x) => (
          <Box flex="1 1 33%" key={x.slug.current}>
            <ArticleSummary
              slug={x.slug.current}
              title={x.title}
              summary={'hallo'}
              coverImageSrc={x.cover?.asset?._ref}
            />
          </Box>
        ))}
      </Box>
    </Tile>
  );
}
