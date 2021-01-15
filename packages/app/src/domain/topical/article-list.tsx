import ArrowIcon from '~/assets/arrow.svg';
import { ArticleSummary } from '~/components-styled/article-summary';
import { Box } from '~/components-styled/base';
import { LinkWithIcon } from '~/components-styled/link-with-icon';
import { Tile } from '~/components-styled/tile';
import { Heading, Text } from '~/components-styled/typography';
import siteText from '~/locale';
import { LatestArticle } from '~/pages';
import { useBreakpoints } from '~/utils/useBreakpoints';

type ArticleListProps = {
  articles: LatestArticle[];
  hideLink?: boolean;
};

export function ArticleList({ articles, hideLink }: ArticleListProps) {
  const breakpoints = useBreakpoints();

  return (
    <Tile>
      <Heading level={2}>
        {siteText.nationaal_actueel.latest_articles.title}
      </Heading>
      <Box display="flex" alignItems="flex-end" mb={4}>
        <Box flex="0 0 33%">
          <Text m={0}>
            {siteText.nationaal_actueel.latest_articles.subtitle}
          </Text>
        </Box>
        <Box
          flex="0 0 66%"
          alignContent="flex-end"
          justifyContent="flex-end"
          display="flex"
        >
          {!hideLink && (
            <LinkWithIcon
              href="/artikelen"
              icon={<ArrowIcon />}
              iconPlacement="right"
            >
              {siteText.nationaal_actueel.latest_articles.all_articles}
            </LinkWithIcon>
          )}
        </Box>
      </Box>
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
              summary={x.summary}
              cover={x.cover}
            />
          </Box>
        ))}
      </Box>
    </Tile>
  );
}
