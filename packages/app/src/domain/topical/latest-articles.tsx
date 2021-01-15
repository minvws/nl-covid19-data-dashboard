import { ArticleSummary } from '~/components-styled/article-summary';
import { Box } from '~/components-styled/base';
import { Tile } from '~/components-styled/tile';
import { Heading } from '~/components-styled/typography';
import siteText from '~/locale';
import { LatestArticle } from '~/pages';
import { useBreakpoints } from '~/utils/useBreakpoints';

type LatestArticlesProps = {
  articles: LatestArticle[];
};

export function LatestArticles({ articles }: LatestArticlesProps) {
  const breakpoints = useBreakpoints();

  return (
    <Tile>
      <Heading level={2}>
        {siteText.nationaal_actueel.latest_articles.title}
      </Heading>
      <Box
        display="flex"
        spacing={4}
        spacingHorizontal={breakpoints.lg}
        flexDirection={{ _: 'column', lg: 'row' }}
      >
        {articles.map((x) => (
          <Box flex="0 0 33%" key={x.slug.current}>
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
